import { Component, h, Method, State } from "@stencil/core";
import CardFormSkeleton from "./card-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { generateTabId } from "../../../utils/utils";
import { checkPkgVersion } from "../../../utils/check-pkg-version";

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

    checkPkgVersion();
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

  render() {
    return (
      <div>
        <CardFormSkeleton isReady={this.isReady} />
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
