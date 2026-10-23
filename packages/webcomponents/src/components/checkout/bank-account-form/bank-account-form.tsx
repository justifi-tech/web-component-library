import { Component, Event, EventEmitter, h, Method, State } from "@stencil/core";
import BankAccountFormSkeleton from "./bank-account-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { generateTabId } from "../../../utils/utils";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import { checkoutStore } from "../../../store/checkout.store";
import {
  ComponentErrorCodes,
  ComponentErrorEvent,
  ComponentErrorMessages,
  ComponentErrorSeverity,
} from "../../../api";
import { Button } from "../../../ui-components";

@Component({
  tag: "bank-account-form",
})
export class BankAccountForm {
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @State() iframeOrigin: string;
  @State() tabId: string;
  @State() iframeState: 'loading' | 'ready' | 'error' = 'loading';

  private accountNumberIframeElement!: HTMLIframeInputElement;
  private routingNumberIframeElement!: HTMLIframeInputElement;
  private hasLoggedAchDisabledWarning = false;
  private loadAbortController?: AbortController;

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = generateTabId();

    checkPkgVersion();
  }

  componentDidRender() {
    if (this.loadAbortController || !this.iframeElements.every(Boolean)) {
      return;
    }

    this.watchIframesLoad();
  }

  disconnectedCallback() {
    this.loadAbortController?.abort();
  }

  private isAchDisabledForCheckout(): boolean {
    return (
      checkoutStore.checkoutLoaded && !checkoutStore.achPaymentsEnabled
    );
  }

  @Method()
  async validate(): Promise<any> {
    if (this.isAchDisabledForCheckout()) {
      return false;
    }
    const accountNumberIsValid = await this.accountNumberIframeElement.validate();
    const routingNumberIsValid = await this.routingNumberIframeElement.validate();
    return accountNumberIsValid && routingNumberIsValid;
  }

  @Method()
  async tokenize({
    clientId,
    paymentMethodMetadata,
    account
  }: {
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  }) {
    if (this.isAchDisabledForCheckout()) {
      return {
        error: {
          message:
            'ACH payments are disabled for this checkout (payment_settings.ach_payments=false).',
        },
      };
    }
    const result = await this.accountNumberIframeElement.tokenize(
      clientId,
      paymentMethodMetadata,
      account,
    );
    return result;
  }

  private get isReady() {
    return this.iframeState === 'ready';
  }

  private get iframeElements(): HTMLIframeInputElement[] {
    return [
      this.accountNumberIframeElement,
      this.routingNumberIframeElement,
    ];
  }

  private watchIframesLoad() {
    this.loadAbortController?.abort();
    const { signal } = (this.loadAbortController = new AbortController());

    const pending = new Set(this.iframeElements.map((element) => element.inputId));

    const loaded = Promise.all(this.iframeElements.map((element) => (
      new Promise<void>((resolve) => {
        element.addEventListener('iframeLoaded', () => {
          pending.delete(element.inputId);
          resolve();
        }, { once: true, signal });
      })
    )));

    const deadline = new Promise<never>((_resolve, reject) => {
      const timeoutId = window.setTimeout(
        () => reject(new Error(`Iframes failed to load: ${Array.from(pending).join(', ')}`)),
        10_000,
      );
      signal.addEventListener('abort', () => {
        window.clearTimeout(timeoutId);
        reject(new Error('iframe load watch aborted'));
      }, { once: true });
    });

    Promise.race([loaded, deadline]).then(() => {
      if (signal.aborted) return;
      this.iframeState = 'ready';
      this.loadAbortController?.abort();
    }).catch((e) => {
      if (signal.aborted) return;
      this.iframeState = 'error';
      this.loadAbortController?.abort();
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.IFRAME_LOAD_ERROR,
        message: ComponentErrorMessages.IFRAME_LOAD_ERROR,
        severity: ComponentErrorSeverity.ERROR,
        data: {
          errorMessage: e.message,
        },
      });
    });
  }

  private reloadIframes = () => {
    this.iframeState = 'loading';
    this.iframeElements.forEach((element) => element.reload());
    this.watchIframesLoad();
  };

  private renderIframeError() {
    return (
      <div>
        <form-alert text={ComponentErrorMessages.IFRAME_LOAD_ERROR} hideAlert={false} />
        <Button variant="link" clickHandler={this.reloadIframes} aria-label="Reload bank account form" type="button">
          Try again
        </Button>
      </div>
    );
  }

  render() {
    if (this.isAchDisabledForCheckout()) {
      if (!this.hasLoggedAchDisabledWarning) {
        console.warn(
          '[bank-account-form] ACH payments are disabled for this checkout (payment_settings.ach_payments=false).'
        );
        this.hasLoggedAchDisabledWarning = true;
      }
      return null;
    }

    return (
      <div>
        {this.iframeState === 'loading' && <BankAccountFormSkeleton />}
        {this.iframeState === 'error' && this.renderIframeError()}
        <hidden-input />
        <div class="container-fluid p-0" style={{
          opacity: this.isReady ? '1' : '0',
          height: this.isReady ? 'auto' : '0',
        }}>
          <div class="row mb-3">
            <iframe-input
              inputId="accountNumber"
              ref={(el) => (this.accountNumberIframeElement = el as HTMLIframeInputElement)}
              label="Account Number"
              iframeOrigin={`${this.iframeOrigin}/v2/accountNumber?tabId=${this.tabId}`}
            />
          </div>
          <div class="row">
            <iframe-input
              inputId="routingNumber"
              ref={(el) => (this.routingNumberIframeElement = el as HTMLIframeInputElement)}
              label="Routing Number"
              iframeOrigin={`${this.iframeOrigin}/v2/routingNumber?tabId=${this.tabId}`}
            />
          </div>
        </div>
      </div>
    );
  }
}
