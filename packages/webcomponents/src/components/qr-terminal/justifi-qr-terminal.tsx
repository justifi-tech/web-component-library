import { Component, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';
import { makeGetCheckout } from '../../actions/checkout/checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import { Checkout, CompletionStatuses, ICheckoutStatus } from '../../api/Checkout';
import { ComponentErrorCodes, ComponentErrorMessages, ComponentErrorSeverity } from '../../api/ComponentError';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';

type TerminalState = 'loading' | 'ready' | 'payment-failed' | 'completed' | 'expired' | 'error';

@Component({
  tag: 'justifi-qr-terminal',
})
export class JustifiQrTerminal {
  @Prop() authToken!: string;
  @Prop() checkoutId!: string;
  @Prop() pollIntervalMs: number = 3000;
  @Prop() pollTimeoutMs: number = 600000;

  @State() terminalState: TerminalState = 'loading';
  @State() paymentStatus: string = '';
  @State() errorMessage: string = '';

  @Event({ eventName: 'checkout-completed' }) checkoutCompleted: EventEmitter<{ checkoutId: string; paymentStatus: string }>;
  @Event({ eventName: 'checkout-expired' }) checkoutExpired: EventEmitter<{ checkoutId: string }>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  private pollIntervalHandle: ReturnType<typeof setInterval> | null = null;
  private pollTimeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private failedDismissHandle: ReturnType<typeof setTimeout> | null = null;
  private seenCompletionCreatedAts: Set<string> = new Set();
  private inFlight: boolean = false;
  private getCheckout: Function;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initialize();
  }

  disconnectedCallback() {
    this.stopAll();
    this.analytics?.cleanup();
  }

  @Watch('authToken')
  @Watch('checkoutId')
  propChanged() {
    this.stopAll();
    this.initialize();
  }

  @Listen('error-event')
  suppressInnerErrors(event: CustomEvent) {
    // Suppress error-event bubbling from inner justifi-checkout-qr-code
    event.stopPropagation();
  }

  private get effectivePollInterval(): number {
    return Math.max(1000, this.pollIntervalMs);
  }

  private initialize() {
    if (!this.authToken || !this.checkoutId) {
      this.errorEvent.emit({
        message: 'authToken and checkoutId are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.terminalState = 'loading';
    this.getCheckout = makeGetCheckout({
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService(),
    });

    this.getCheckout({
      onSuccess: ({ checkout }: { checkout: Checkout }) => this.handleInitialLoad(checkout),
      onError: ({ error, code, severity }: { error: string; code: ComponentErrorCodes; severity: ComponentErrorSeverity }) => {
        this.terminalState = 'error';
        this.errorMessage = error;
        this.errorEvent.emit({ message: error, errorCode: code, severity });
      },
    });
  }

  private handleInitialLoad(checkout: Checkout) {
    switch (checkout.status) {
      case ICheckoutStatus.expired:
        this.terminalState = 'expired';
        this.checkoutExpired.emit({ checkoutId: this.checkoutId });
        this.errorEvent.emit({
          message: ComponentErrorMessages.CHECKOUT_EXPIRED,
          errorCode: ComponentErrorCodes.CHECKOUT_EXPIRED,
          severity: ComponentErrorSeverity.ERROR,
        });
        break;

      case ICheckoutStatus.completed:
        this.terminalState = 'completed';
        this.paymentStatus = this.resolvePaymentStatus(checkout);
        this.checkoutCompleted.emit({ checkoutId: this.checkoutId, paymentStatus: this.paymentStatus });
        break;

      default:
        (checkout.completions ?? []).forEach((c) => this.seenCompletionCreatedAts.add(c.created_at));
        this.terminalState = 'ready';
        this.startPolling();
        break;
    }
  }

  private startPolling() {
    this.pollTimeoutHandle = setTimeout(() => {
      this.stopAll();
      this.terminalState = 'error';
      this.errorMessage = 'Checkout polling timed out';
      this.errorEvent.emit({
        message: 'Checkout polling timed out',
        errorCode: ComponentErrorCodes.FETCH_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }, this.pollTimeoutMs);

    this.pollIntervalHandle = setInterval(() => this.tick(), this.effectivePollInterval);
  }

  private tick() {
    if (this.inFlight) return;
    this.inFlight = true;

    this.getCheckout({
      onSuccess: ({ checkout }: { checkout: Checkout }) => {
        this.inFlight = false;
        this.handlePollResult(checkout);
      },
      onError: ({ error, code, severity }: { error: string; code: ComponentErrorCodes; severity: ComponentErrorSeverity }) => {
        this.inFlight = false;
        this.stopAll();
        this.terminalState = 'error';
        this.errorMessage = error;
        this.errorEvent.emit({ message: error, errorCode: code, severity });
      },
    });
  }

  private handlePollResult(checkout: Checkout) {
    const completions = checkout.completions ?? [];

    const newFailures = completions.filter(
      (c) => !this.seenCompletionCreatedAts.has(c.created_at) && c.payment_status === 'failed',
    );
    newFailures.forEach((c) => this.seenCompletionCreatedAts.add(c.created_at));

    if (newFailures.length > 0) {
      this.terminalState = 'payment-failed';
      if (this.failedDismissHandle) clearTimeout(this.failedDismissHandle);
      this.failedDismissHandle = setTimeout(() => {
        if (this.terminalState === 'payment-failed') this.terminalState = 'ready';
      }, 3000);
    }

    if (checkout.status === ICheckoutStatus.completed) {
      this.stopAll();
      this.terminalState = 'completed';
      this.paymentStatus = this.resolvePaymentStatus(checkout);
      this.checkoutCompleted.emit({ checkoutId: this.checkoutId, paymentStatus: this.paymentStatus });
      return;
    }

    if (checkout.status === ICheckoutStatus.expired) {
      this.stopAll();
      this.terminalState = 'expired';
      this.checkoutExpired.emit({ checkoutId: this.checkoutId });
      this.errorEvent.emit({
        message: ComponentErrorMessages.CHECKOUT_EXPIRED,
        errorCode: ComponentErrorCodes.CHECKOUT_EXPIRED,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private resolvePaymentStatus(checkout: Checkout): string {
    const completions = checkout.completions ?? [];
    const sorted = [...completions].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    const latestStatus = sorted[0]?.payment_status;
    if (latestStatus === CompletionStatuses.succeeded) return 'succeeded';
    if (latestStatus == null) {
      return checkout.successful_payment_id ? 'succeeded' : 'pending';
    }
    return 'pending';
  }

  private stopAll() {
    if (this.pollIntervalHandle) { clearInterval(this.pollIntervalHandle); this.pollIntervalHandle = null; }
    if (this.pollTimeoutHandle) { clearTimeout(this.pollTimeoutHandle); this.pollTimeoutHandle = null; }
    if (this.failedDismissHandle) { clearTimeout(this.failedDismissHandle); this.failedDismissHandle = null; }
    this.inFlight = false;
  }

  render() {
    if (!this.authToken || !this.checkoutId) return null;

    return (
      <div>
        {this.terminalState === 'loading' && null}

        {(this.terminalState === 'ready' || this.terminalState === 'payment-failed') && (
          <div>
            <justifi-checkout-qr-code checkoutId={this.checkoutId} />
            {this.terminalState === 'payment-failed' && (
              <p>Payment failed. Please try again.</p>
            )}
            {this.terminalState === 'ready' && (
              <p>Scan to pay</p>
            )}
          </div>
        )}

        {this.terminalState === 'completed' && (
          <div>
            {this.paymentStatus === 'succeeded'
              ? <p>Payment received</p>
              : <p>Payment pending</p>
            }
          </div>
        )}

        {this.terminalState === 'expired' && (
          <p>Checkout expired. Please create a new checkout.</p>
        )}

        {this.terminalState === 'error' && (
          <p>{this.errorMessage}</p>
        )}
      </div>
    );
  }
}
