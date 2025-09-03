import { Component, h, Host, Method, State } from "@stencil/core";
import CardFormSkeleton from "./card-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { generateTabId } from "../../../utils/utils";

@Component({
  tag: "card-form",
})
export class CardForm {
  @State() isReady: boolean = false;
  @State() iframeOrigin: string;
  @State() tabId: string;

  private cardNumberIframeElement!: HTMLIframeInputElement;
  private expirationMonthIframeElement!: HTMLIframeInputElement;
  private expirationYearIframeElement!: HTMLIframeInputElement;
  private cvvIframeElement!: HTMLIframeInputElement;

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = generateTabId();
  }

  componentDidRender() {
    const elements = [
      this.cardNumberIframeElement,
      this.expirationMonthIframeElement,
      this.expirationYearIframeElement,
      this.cvvIframeElement,
    ];

    Promise.all(elements.map((element) => {
      return new Promise<void>((resolve) => {
        element.addEventListener('iframeLoaded', () => { resolve(); });
      });
    })).then(() => {
      this.isReady = true;
    });
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
  async tokenize(
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  ) {
    return this.cardNumberIframeElement.tokenize(
      clientId,
      paymentMethodMetadata,
      account,
    );
  }

  render() {
    return (
      <Host>
        <CardFormSkeleton isReady={this.isReady} />
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
          <div class="d-flex align-items-start">
            <div class="flex-fill me-3">
              <iframe-input
                inputId="expirationMonth"
                ref={(el) => (this.expirationMonthIframeElement = el as HTMLIframeInputElement)}
                label="Exp. Month"
                iframeOrigin={`${this.iframeOrigin}/v2/expirationMonth?tabId=${this.tabId}`}
              />
            </div>
            <div class="flex-fill me-3">
              <iframe-input
                inputId="expirationYear"
                ref={(el) => (this.expirationYearIframeElement = el as HTMLIframeInputElement)}
                label="Exp. Year"
                iframeOrigin={`${this.iframeOrigin}/v2/expirationYear?tabId=${this.tabId}`}
              />
            </div>
            <div class="flex-fill">
              <iframe-input
                inputId="CVV"
                ref={(el) => (this.cvvIframeElement = el as HTMLIframeInputElement)}
                label="CVV"
                iframeOrigin={`${this.iframeOrigin}/v2/CVV?tabId=${this.tabId}`}
              />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
