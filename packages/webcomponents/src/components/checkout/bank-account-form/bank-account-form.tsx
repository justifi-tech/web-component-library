import { Component, Event, EventEmitter, h, Method, Prop, State } from "@stencil/core";
import BankAccountFormSkeleton from "./bank-account-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { generateTabId } from "../../../utils/utils";
import { detectDuplicateVersion } from "../../../utils/detect-duplicate-version";
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

  @Prop() showAccountNumberConfirmation?: boolean = false;

  private accountNumberIframeElement!: HTMLIframeInputElement;
  private accountNumberConfirmationIframeElement?: HTMLIframeInputElement;
  private routingNumberIframeElement!: HTMLIframeInputElement;
  private hasLoggedAchDisabledWarning = false;
  private loadAbortController?: AbortController;
  private loadedInputIds = new Set<string>();
  private watchedInputIds = '';

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = generateTabId();

    detectDuplicateVersion();
  }

  componentDidRender() {
    if (this.iframeElements.length < this.expectedIframeCount) {
      return;
    }

    // Re-watch when the rendered field set changes -- showAccountNumberConfirmation
    // can flip on after the first watch already finished.
    const inputIds = this.iframeElements.map((element) => element.inputId).join(',');
    if (inputIds === this.watchedInputIds) {
      return;
    }

    this.watchedInputIds = inputIds;
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
  async validate(): Promise<{ isValid: boolean }> {
    if (this.isAchDisabledForCheckout()) {
      return { isValid: false };
    }

    const elements = this.iframeElements;

    // A field that has not rendered yet cannot be validated -- fail closed
    // rather than report a pass for a form that is not all there.
    if (elements.length < this.expectedIframeCount) {
      return { isValid: false };
    }

    // Sequential on purpose: the parent correlates iframe replies by eventType
    // alone, with no request id, so concurrent validates would cross replies.
    const results: any[] = [];
    for (const element of elements) {
      results.push(await element.validate());
    }

    return { isValid: results.every((result) => result?.isValid === true) };
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
    // tokenize() is a public @Method: an integrator with their own submit button
    // can reach it without validate(), so the mismatch check has to live here too.
    if (this.showAccountNumberConfirmation) {
      const confirmation = await this.accountNumberConfirmationIframeElement?.validate();

      if (confirmation?.isValid !== true) {
        return {
          error: {
            code: 'validation_error',
            message:
              confirmation?.error?.message ||
              'The entered value does not match the account number',
          },
        };
      }
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

  private get expectedIframeCount(): number {
    return this.showAccountNumberConfirmation ? 3 : 2;
  }

  private get iframeElements(): HTMLIframeInputElement[] {
    return [
      this.accountNumberIframeElement,
      ...(this.showAccountNumberConfirmation
        ? [this.accountNumberConfirmationIframeElement]
        : []),
      this.routingNumberIframeElement,
    ].filter(Boolean) as HTMLIframeInputElement[];
  }

  private watchIframesLoad() {
    this.loadAbortController?.abort();
    const { signal } = (this.loadAbortController = new AbortController());

    const pending = new Set(
      this.iframeElements
        .filter((element) => !this.loadedInputIds.has(element.inputId))
        .map((element) => element.inputId),
    );

    const loaded = Promise.all(this.iframeElements.map((element) => (
      new Promise<void>((resolve) => {
        // iframeLoaded is a once: true listener, so an element that already
        // loaded will never fire again on a re-watch.
        if (this.loadedInputIds.has(element.inputId)) {
          resolve();
          return;
        }

        element.addEventListener('iframeLoaded', () => {
          this.loadedInputIds.add(element.inputId);
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

      if (pending.has('accountNumberConfirmation')) {
        console.error(
          '[bank-account-form] The "Confirm Account Number" field did not load. ' +
          `show-account-number-confirmation needs an iframe release that serves ${this.iframeOrigin}/v2/accountNumberConfirmation -- ` +
          'unset the prop until that release is live.'
        );
      }

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
    this.loadedInputIds.clear();
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
          {this.showAccountNumberConfirmation && (
            <div class="row mb-3">
              <iframe-input
                inputId="accountNumberConfirmation"
                ref={(el) => (this.accountNumberConfirmationIframeElement = el as HTMLIframeInputElement)}
                label="Confirm Account Number"
                iframeOrigin={`${this.iframeOrigin}/v2/accountNumberConfirmation?tabId=${this.tabId}`}
              />
            </div>
          )}
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
