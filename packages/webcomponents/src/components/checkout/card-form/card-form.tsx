import { Component, Event, EventEmitter, h, Host, Method, Prop, State } from "@stencil/core";

import CardFormSkeleton from "./card-form-skeleton";

@Component({
  tag: "card-form",
})
export class CardForm {
  @Prop() iframeOrigin: string;

  @Event({ eventName: 'ready-event' }) eventReady: EventEmitter<void>;

  @State() isReady: boolean = false;

  private cardNumberIframeElement!: HTMLIframeInputElement;
  private expirationMonthIframeElement!: HTMLIframeInputElement;
  private expirationYearIframeElement!: HTMLIframeInputElement;
  private cvvIframeElement!: HTMLIframeInputElement;

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
      this.eventReady.emit();
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
              iframeOrigin={`${this.iframeOrigin}/v2/cardNumber`}
            />
          </div>
          <div class="row">
            <div class="col-4 align-content-end">
              <iframe-input
                inputId="expirationMonth"
                ref={(el) => (this.expirationMonthIframeElement = el as HTMLIframeInputElement)}
                label="Expiration"
                iframeOrigin={`${this.iframeOrigin}/v2/expirationMonth`}
              />
            </div>
            <div class="col-4 align-content-end">
              <iframe-input
                inputId="expirationYear"
                ref={(el) => (this.expirationYearIframeElement = el as HTMLIframeInputElement)}
                label=""
                iframeOrigin={`${this.iframeOrigin}/v2/expirationYear`}
              />
            </div>
            <div class="col-4 align-content-end">
              <iframe-input
                inputId="CVV"
                ref={(el) => (this.cvvIframeElement = el as HTMLIframeInputElement)}
                label="CVV"
                iframeOrigin={`${this.iframeOrigin}/v2/CVV`}
              />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
