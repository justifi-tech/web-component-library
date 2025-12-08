import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
  Method
} from '@stencil/core';
import RefundPaymentSchema from './refund-payment-schema';
import { ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity, ComponentSubmitEvent, IApiResponse, IRefund, IRefundPayload, IPayment, Payment, RefundPayload } from '../../api';
import { FormController } from '../../ui-components/form/form';
import { Button, StyledHost } from '../../ui-components';
import { formatCurrency } from '../../utils/utils';
import refundReasonOptions from './refund-reason-options';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPaymentDetails } from '../../actions/payment/get-payment-details';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { makePostRefund } from '../../actions/refund/refund-actions';
import { RefundService } from '../../api/services/refund.service';
import { makePostVoid } from '../../actions/void/void-actions';
import { VoidService } from '../../api/services/void.service';
import { RefundLoading } from './refund-loading';

@Component({
  tag: 'justifi-refund-payment',
  shadow: true,
})
export class RefundPayment {
  @State() formController: FormController;
  @State() refundPayload: IRefundPayload = {};
  @State() displayAmount: string = '';
  @State() errors: any = {};
  @State() paymentLoading: boolean = true;
  @State() refundLoading: boolean = false;
  @State() submitDisabled: boolean;
  @State() payment: Payment;
  
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() paymentId: string;
  @Prop() hideSubmitButton?: boolean = false;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeApi();
    this.formController = new FormController(RefundPaymentSchema());
  }

  private handleError(code: ComponentErrorCodes, errorMessage: string, severity: ComponentErrorSeverity) {
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  private checkAmount(amount: number) {
    return amount > 0;
  }

  private handleInvalidAmount() {
    this.submitDisabled = true;
    const errorMessage = 'Refund amount must be greater than 0';
    this.handleError(ComponentErrorCodes.INVALID_REFUND_AMOUNT, errorMessage, ComponentErrorSeverity.ERROR);
  }

  private isPaymentCreatedWithin25Minutes(): boolean {
    if (!this.payment || !this.payment?.created_at) {
      return false;
    }
    
    const paymentCreatedAt = new Date(this.payment.created_at);
    const now = new Date();
    const diffInMinutes = (now.getTime() - paymentCreatedAt.getTime()) / (1000 * 60);
    
    return diffInMinutes <= 25;
  }

  private initializeFormController() {
    const amount = this.refundPayload.amount;
    const amountRefundable = amount ? amount.toString() : '0';
    this.formController = new FormController(RefundPaymentSchema(amountRefundable));
    
    this.formController.setInitialValues({
      amount: amountRefundable
    });

    this.formController.values.subscribe(values => {
      this.refundPayload = { ...values };
    });

    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  private initializeApi() {
    if (this.paymentId && this.authToken) {
      const getPayment = makeGetPaymentDetails({
        id: this.paymentId,
        authToken: this.authToken,
        service: new PaymentService()
      });
      
      getPayment({
        onSuccess: ({ payment }) => {
          this.payment = payment;
          this.refundPayload = new RefundPayload({amount: payment.amount_refundable});
        },
        onError: ({ error, code, severity }) => {
          this.handleError(code, error, severity);
        },
        final: () => {
          const amount = this.refundPayload.amount;
          const validAmount = this.checkAmount(amount);
          !validAmount ? this.handleInvalidAmount() : this.initializeFormController();
          this.paymentLoading = false;
        }
      })
    } else {
      const errorMessage = 'Payment ID and Auth Token are required';
      this.handleError(ComponentErrorCodes.MISSING_PROPS, errorMessage, ComponentErrorSeverity.ERROR);
    }
  }

  
  @Method()
  async refundPayment(event?: CustomEvent): Promise<IRefund | IPayment> {
    event && event.preventDefault();

    const valid = await this.formController.validate();
    if (!valid) return;

    const values = this.formController.values.getValue();
    this.refundLoading = true;

    // Check if payment was created within 25 minutes and try to void first
    if (this.isPaymentCreatedWithin25Minutes()) {
      return this.tryVoidPayment();
    }

    // Otherwise, proceed with refund
    return this.processRefund(values);
  }

  private async tryVoidPayment(): Promise<IRefund | IPayment> {
    const postVoid = makePostVoid({
      authToken: this.authToken,
      accountId: this.accountId,
      paymentId: this.paymentId,
      service: new VoidService()
    });

    return new Promise((resolve) => {
      let voidResponse: IApiResponse<IPayment>;
      let voidAttempted = false;
      const values = this.formController.values.getValue();

      postVoid({
        onSuccess: (response) => { 
          voidResponse = response;
          voidAttempted = true;
        },
        onError: ({ error, code, severity}) => {
          // If void fails, fall back to refund
          voidAttempted = true;
          this.handleError(error, code, severity);
          this.processRefund(values)
            .then(resolve);
        },
        final: () => {
          if (voidResponse && !voidResponse.error && voidAttempted) {
            this.submitEvent.emit({ response: voidResponse });
            this.submitDisabled = true;
            this.refundLoading = false;
            resolve(voidResponse.data);
          }
        },
      });
    });
  }

  private async processRefund(values: any): Promise<IRefund> {
    const postRefund = makePostRefund({
      authToken: this.authToken,
      accountId: this.accountId,
      paymentId: this.paymentId,
      service: new RefundService()
    });

    return new Promise((resolve) => {
      let refundResponse: IApiResponse<IRefund>;
  
      postRefund({
        refundBody: values,
        onSuccess: (response) => { refundResponse = response; },
        onError: ({ error, code, severity }) => {
          refundResponse = error;
          this.handleError(error, code, severity);
        },
        final: () => {
          this.submitEvent.emit({ response: refundResponse });
          this.submitDisabled = true;
          this.refundLoading = false;
          resolve(refundResponse.data);
        },
      });
    });
  }
  
  render() {
    if (this.paymentLoading) {
      return <RefundLoading />
    }

    const defaultValues = this.formController.getInitialValues();
    const currentRefundAmount = this.refundPayload.amount;

    return (
      <StyledHost>
        <form>
          <fieldset>
            <div class="row gy-3">
              <div class="col-12">
                <form-control-monetary
                  name="amount"
                  label="Refund Amount"
                  defaultValue={defaultValues.amount}
                  inputHandler={this.inputHandler}
                  errorText={this.errors.amount}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name="reason"
                  label="Reason for refund (optional)"
                  defaultValue={defaultValues.reason}
                  inputHandler={this.inputHandler}
                  options={refundReasonOptions}
                  errorText={this.errors.reason}
                />
              </div>
              <div class="col-12">
                <form-control-textarea
                  name="description"
                  label="Note (optional)"
                  defaultValue={defaultValues.description}
                  inputHandler={this.inputHandler}
                  maxLength={250}
                  errorText={this.errors.description}
                />
              </div>
              <div class="form-group d-flex flex-row-reverse">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={this.refundPayment.bind(this)}
                  isLoading={this.paymentLoading || this.refundLoading}
                  hidden={this.hideSubmitButton}
                  disabled={this.submitDisabled}
                >
                  {`Refund ${formatCurrency(+currentRefundAmount)}`}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}
