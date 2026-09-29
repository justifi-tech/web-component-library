import { Component, Event, EventEmitter, h, Method, State } from "@stencil/core";
import CardFormSkeleton from "./card-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { generateTabId } from "../../../utils/utils";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import {
  ComponentErrorCodes,
  ComponentErrorEvent,
  ComponentErrorMessages,
  ComponentErrorSeverity,
} from "../../../api";
import { Button } from "../../../ui-components";

@Component({
  tag: "card-form",
})
export class CardForm {
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @State() iframeOrigin: string;
  @State() tabId: string;
  @State() iframeState: 'loading' | 'ready' | 'error' = 'loading';

  private cardNumberIframeElement!: HTMLIframeInputElement;
  private expirationMonthIframeElement!: HTMLIframeInputElement;
  private expirationYearIframeElement!: HTMLIframeInputElement;
  private cvvIframeElement!: HTMLIframeInputElement;
  private loadAbortController?: AbortController;

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = generateTabId();

    checkPkgVersion();
  }

  componentDidLoad() {
    this.watchIframesLoad();
  }

  disconnectedCallback() {
    this.loadAbortController?.abort();
  }

  @Method()
  async validate(): Promise<any> {
    const cardNumberIsValid = await this.cardNumberIframeElement.validate();
    const expirationMonthIsValid = await this.expirationMonthIframeElement.validate();
    const expirationYearIsValid = await this.expirationYearIframeElement.validate();
    const cvvIsValid = await this.cvvIframeElement.validate();
    return cardNumberIsValid && expirationMonthIsValid && expirationYearIsValid && cvvIsValid;
  }

  @Method()
  async tokenize({
    clientId,
    paymentMethodMetadata,
    account,
  }: {
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  }) {
    const result = await this.cardNumberIframeElement.tokenize(
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
      this.cardNumberIframeElement,
      this.expirationMonthIframeElement,
      this.expirationYearIframeElement,
      this.cvvIframeElement,
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
        <Button variant="link" clickHandler={this.reloadIframes} aria-label="Reload payment form" type="button">
          Try again
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.iframeState === 'loading' && <CardFormSkeleton />}
        {this.iframeState === 'error' && this.renderIframeError()}
        <hidden-input />
        <div class="container-fluid p-0" style={{
          opacity: this.isReady ? '1' : '0',
          height: this.isReady ? 'auto' : '0',
        }}>
          <div class="mb-3">
            <iframe-input
              inputId="cardNumber"
              ref={(el) => (this.cardNumberIframeElement = el as HTMLIframeInputElement)}
              label="Card Number"
              iframeOrigin={`${this.iframeOrigin}/v2/cardNumber?tabId=${this.tabId}`}
            />
          </div>
          <div class="row">
            <div class="col-4 align-content-end">
              <iframe-input
                inputId="expirationMonth"
                ref={(el) => (this.expirationMonthIframeElement = el as HTMLIframeInputElement)}
                label="Expiration"
                iframeOrigin={`${this.iframeOrigin}/v2/expirationMonth?tabId=${this.tabId}`}
              />
            </div>
            <div class="col-4 align-content-end">
              <iframe-input
                inputId="expirationYear"
                ref={(el) => (this.expirationYearIframeElement = el as HTMLIframeInputElement)}
                label=""
                iframeOrigin={`${this.iframeOrigin}/v2/expirationYear?tabId=${this.tabId}`}
              />
            </div>
            <div class="col-4 align-content-end">
              <iframe-input
                inputId="CVV"
                ref={(el) => (this.cvvIframeElement = el as HTMLIframeInputElement)}
                label="CVV"
                iframeOrigin={`${this.iframeOrigin}/v2/CVV?tabId=${this.tabId}`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
