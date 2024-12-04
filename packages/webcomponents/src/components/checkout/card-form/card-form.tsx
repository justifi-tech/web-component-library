import { Component, h, Host, Method } from "@stencil/core";

@Component({
  tag: "card-form",
})
export class CardForm {
  private cardNumberIframeElement!: HTMLIframeInputElement;
  private expirationMonthIframeElement!: HTMLIframeInputElement;
  private expirationYearIframeElement!: HTMLIframeInputElement;
  private cvvIframeElement!: HTMLIframeInputElement;

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
      <Host class="container-fluid p-0" >
        <div class="mb-3">
          <iframe-input
            inputId="cardNumber"
            ref={(el) => (this.cardNumberIframeElement = el as HTMLIframeInputElement)}
            label="Card Number"
            iframeOrigin={`${IFRAME_ORIGIN}/cardNumber`}
          />
        </div>
        <div class="row">
          <div class="col-4">
            <iframe-input
              inputId="expirationMonth"
              ref={(el) => (this.expirationMonthIframeElement = el as HTMLIframeInputElement)}
              label="Expiration"
              iframeOrigin={`${IFRAME_ORIGIN}/expirationMonth`}
            />
          </div>
          <div class="col-4">
            <iframe-input
              inputId="expirationYear"
              ref={(el) => (this.expirationYearIframeElement = el as HTMLIframeInputElement)}
              iframeOrigin={`${IFRAME_ORIGIN}/expirationYear`}
            />
          </div>
          <div class="col-4">
            <iframe-input
              inputId="CVV"
              ref={(el) => (this.cvvIframeElement = el as HTMLIframeInputElement)}
              label="CVV"
              iframeOrigin={`${IFRAME_ORIGIN}/CVV`}
            />
          </div>
        </div>
      </Host>
    );
  }
}
