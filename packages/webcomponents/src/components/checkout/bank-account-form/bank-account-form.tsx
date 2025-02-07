import { Component, h, Host, Method, Prop } from "@stencil/core";

@Component({
  tag: "bank-account-form",
})
export class BankAccountForm {
  @Prop() iframeOrigin: string;

  private accountNumberIframeElement!: HTMLIframeInputElement;
  private routingNumberIframeElement!: HTMLIframeInputElement;

  @Method()
  async validate(): Promise<any> {
    const accountNumberIsValid = await this.accountNumberIframeElement.validate();
    const routingNumberIsValid = await this.routingNumberIframeElement.validate();
    return accountNumberIsValid && routingNumberIsValid;
  }

  @Method()
  async tokenize(
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  ) {
    return this.accountNumberIframeElement.tokenize(
      clientId,
      paymentMethodMetadata,
      account,
    );
  }

  render() {
    return (
      <Host>
        <div class="container-fluid p-0" >
          <div class="row mb-3">
            <iframe-input
              inputId="accountNumber"
              ref={(el) => (this.accountNumberIframeElement = el as HTMLIframeInputElement)}
              label="Account Number"
              iframeOrigin={`${this.iframeOrigin}/v2/accountNumber`}
            />
          </div>
          <div class="row">
            <iframe-input
              inputId="routingNumber"
              ref={(el) => (this.routingNumberIframeElement = el as HTMLIframeInputElement)}
              label="Routing Number"
              iframeOrigin={`${this.iframeOrigin}/v2/routingNumber`}
            />
          </div>
        </div>
      </Host>
    );
  }
}
