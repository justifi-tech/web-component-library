import { Component, Event, EventEmitter, h, Method, State } from "@stencil/core";
import CardFormSkeleton from "./card-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { generateTabId } from "../../../utils/utils";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import { ComponentErrorCodes, ComponentErrorEvent, ComponentErrorMessages } from "../../../api";

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

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = generateTabId();

    checkPkgVersion();
  }

  componentDidRender() {
    this.watchIframesLoad();
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

  private watchIframesLoad() {
    const elements = [
      this.cardNumberIframeElement,
      this.expirationMonthIframeElement,
      this.expirationYearIframeElement,
      this.cvvIframeElement,
    ];

    Promise.all(elements.map((element) => {
      return new Promise<void>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
          element.removeEventListener('iframeLoaded', handleIframeLoaded);
          reject(`Iframe ${element.inputId} failed to load`);
        }, 10_000);

        function handleIframeLoaded() {
          window.clearTimeout(timeoutId);
          element.removeEventListener('iframeLoaded', handleIframeLoaded);
          resolve();
        }

        element.addEventListener('iframeLoaded', handleIframeLoaded, { once: true });
      });
    })).then(() => {
      this.iframeState = 'ready';
    }).catch((e) => {
      this.iframeState = 'error';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.IFRAME_LOAD_ERROR,
        message: ComponentErrorMessages.IFRAME_LOAD_ERROR,
        data: {
          errorMessage: e.message,
        },
      });
    });
  }

  private reloadIframes() {
    this.iframeState = 'loading';
    const elements = [
      this.cardNumberIframeElement,
      this.expirationMonthIframeElement,
      this.expirationYearIframeElement,
      this.cvvIframeElement,
    ];
    elements.forEach((element) => {
      element.reload();
    });
    this.watchIframesLoad();
  }

  private renderIframeError() {
    return (
      <div>
        <span class="text-danger">Error loading iframe</span>
        <span class="mx-2" />
        <button class="btn p-0" onClick={this.reloadIframes.bind(this)} aria-label="Reload iframes" aria-role="button" type="button">
          <span>
            &#8634;
          </span>
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.iframeState === 'loading' && <CardFormSkeleton />}
        {this.iframeState === 'error' && this.renderIframeError()}
        <div>
          <hidden-input />
          <div class="container-fluid p-0" style={{
            opacity: this.iframeState === 'ready' ? '1' : '0',
            height: this.iframeState === 'ready' ? 'auto' : '0',
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
      </div>
    );
  }
}
