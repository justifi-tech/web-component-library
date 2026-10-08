import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { StyledHost } from '../../../../ui-components';
import { checkoutStore, onChange } from '../../../../store/checkout.store';
import { PaypalService } from '../../../../api/services/paypal.service';
import { IPaypalOrder, PaypalFundingSource } from '../../../../api/Paypal';
import {
  IPaypalSdk,
  IPaypalSdkInstance,
  IPaypalSession,
  PaypalErrorCode,
  PaypalErrorCodeType,
  PAYPAL_COMPONENTS,
  PAYPAL_DEFAULT_CURRENCY,
  PAYPAL_PAGE_TYPE,
  PAYPAL_PRESENTATION_MODE,
  PAYPAL_SCRIPT_DATA_TEST_ID,
  paypalScriptUrl,
  VENMO_SUPPORTED_CURRENCY,
} from './paypal';

@Component({
  tag: 'justifi-paypal',
  shadow: true,
})
export class JustifiPaypal {
  private paypalService = new PaypalService();
  private sdkInstance: IPaypalSdkInstance | undefined;
  private paypalSession: IPaypalSession | undefined;
  private venmoSession: IPaypalSession | undefined;
  private pendingOrderId?: string;

  @State() paypalEligible: boolean = false;
  @State() venmoEligible: boolean = false;

  @Event() paypalStarted!: EventEmitter<{
    fundingSource: PaypalFundingSource;
  }>;
  @Event() paypalCompleted!: EventEmitter<{
    success: boolean;
    paymentMethodId?: string;
    fundingSource: PaypalFundingSource;
  }>;
  @Event() paypalCancelled!: EventEmitter<{
    fundingSource: PaypalFundingSource;
  }>;
  @Event() paypalError!: EventEmitter<{ error: string; code: string }>;

  componentDidLoad() {
    if (checkoutStore.checkoutLoaded) {
      this.initializePaypal();
    } else {
      onChange('checkoutLoaded', (loaded) => {
        if (loaded) this.initializePaypal();
      });
    }
  }

  private get currencyCode(): string {
    return (
      checkoutStore.paymentCurrency || PAYPAL_DEFAULT_CURRENCY
    ).toUpperCase();
  }

  private emitError(error: string, code: PaypalErrorCodeType) {
    this.paypalError.emit({ error, code });
  }

  // The script tag is the dedup token, so a second instance (or a remount)
  // reuses the in-flight load instead of appending another SDK.
  private loadPaypalScript(): Promise<IPaypalSdk> {
    const loaded = (window as any).paypal as IPaypalSdk | undefined;
    if (loaded) return Promise.resolve(loaded);

    return new Promise((resolve, reject) => {
      const selector = `script[data-test-id="${PAYPAL_SCRIPT_DATA_TEST_ID}"]`;
      let script = document.head.querySelector<HTMLScriptElement>(selector);

      if (!script) {
        script = document.createElement('script');
        script.src = paypalScriptUrl(checkoutStore.checkoutMode);
        script.async = true;
        script.setAttribute('data-test-id', PAYPAL_SCRIPT_DATA_TEST_ID);
        document.head.appendChild(script);
      }

      script.addEventListener('load', () => {
        const paypal = (window as any).paypal as IPaypalSdk | undefined;
        if (paypal) {
          resolve(paypal);
        } else {
          reject(
            new Error('Paypal script loaded but window.paypal is undefined')
          );
        }
      });
      script.addEventListener('error', () =>
        reject(new Error('Error loading Paypal script'))
      );
    });
  }

  private metadataId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private async initializePaypal() {
    const clientId = checkoutStore.paypalProviderClientId;

    if (!clientId) {
      this.paypalEligible = false;
      this.venmoEligible = false;
      this.emitError('Missing Paypal client id', PaypalErrorCode.CONFIG_ERROR);
      return;
    }

    try {
      const paypal = await this.loadPaypalScript();

      this.sdkInstance = await paypal.createInstance({
        clientId,
        components: PAYPAL_COMPONENTS,
        pageType: PAYPAL_PAGE_TYPE,
        metadataId: this.metadataId(),
      });

      const eligibleMethods = await this.sdkInstance.findEligibleMethods({
        currencyCode: this.currencyCode,
      });

      this.paypalEligible = eligibleMethods.isEligible('paypal');
      this.venmoEligible = eligibleMethods.isEligible('venmo');

      if (this.paypalEligible) {
        this.paypalSession = this.sdkInstance.createPayPalOneTimePaymentSession(
          this.sessionOptions('paypal')
        );
      }
      if (this.venmoEligible) {
        this.venmoSession = this.sdkInstance.createVenmoOneTimePaymentSession(
          this.sessionOptions('venmo')
        );
      }
    } catch (error) {
      this.paypalEligible = false;
      this.venmoEligible = false;
      this.emitError(
        (error as any)?.message || 'Error initializing Paypal',
        PaypalErrorCode.INITIALIZATION_ERROR
      );
    }
  }

  private sessionOptions(fundingSource: PaypalFundingSource) {
    return {
      onApprove: () =>
        this.paypalCompleted.emit({
          success: true,
          paymentMethodId: this.pendingOrderId,
          fundingSource,
        }),
      onCancel: () => this.paypalCancelled.emit({ fundingSource }),
      onError: (error: any) =>
        this.emitError(
          error?.message || 'Paypal payment failed',
          PaypalErrorCode.PAYMENT_FAILED
        ),
    };
  }

  private async createOrder(
    fundingSource: PaypalFundingSource
  ): Promise<IPaypalOrder> {
    const response = await this.paypalService.createPaypalOrder(
      checkoutStore.authToken,
      checkoutStore.checkoutId,
      fundingSource
    );

    if (response?.error) {
      const message =
        typeof response.error === 'string'
          ? response.error
          : response.error.message;
      throw new Error(message || 'Could not create the Paypal order');
    }

    const order = response?.data;
    if (!order?.provider_order_id) {
      throw new Error('Paypal order is missing a provider order id');
    }

    this.pendingOrderId = order.id;
    return order;
  }

  private startSession = async (
    session: IPaypalSession,
    fundingSource: PaypalFundingSource
  ) => {
    if (!session) return;

    this.pendingOrderId = undefined;
    this.paypalStarted.emit({ fundingSource });

    let orderFailed = false;

    const order = this.createOrder(fundingSource)
      .then((created) => ({ orderId: created.provider_order_id }))
      .catch((error) => {
        orderFailed = true;
        this.emitError(
          (error as any)?.message || 'Could not create the Paypal order',
          PaypalErrorCode.ORDER_ERROR
        );
        throw error;
      });

    // The SDK is what normally consumes this rejection; swallow a copy so a
    // failed order can never surface as an unhandled rejection.
    order.catch(() => undefined);

    try {
      await session.start(
        { presentationMode: PAYPAL_PRESENTATION_MODE },
        order
      );
    } catch (error) {
      if (orderFailed) return;
      this.emitError(
        (error as any)?.message || 'Paypal payment failed',
        PaypalErrorCode.PAYMENT_FAILED
      );
    }
  };

  render() {
    if (!checkoutStore.paypalEnabled) return null;

    const showVenmo =
      this.venmoEligible && this.currencyCode === VENMO_SUPPORTED_CURRENCY;

    if (!this.paypalEligible && !showVenmo) return null;

    return (
      <StyledHost>
        <div class="paypal-buttons">
          {this.paypalEligible && (
            <paypal-button
              type="pay"
              onClick={() => this.startSession(this.paypalSession!, 'paypal')}
            />
          )}
          {showVenmo && (
            <venmo-button
              type="pay"
              onClick={() => this.startSession(this.venmoSession!, 'venmo')}
            />
          )}
        </div>

        <style>
          {`
            .paypal-buttons {
              display: flex;
              gap: 8px;
              width: 100%;
            }
            .paypal-buttons > * {
              flex: 1 1 0;
              min-width: 0;
            }
          `}
        </style>
      </StyledHost>
    );
  }
}
