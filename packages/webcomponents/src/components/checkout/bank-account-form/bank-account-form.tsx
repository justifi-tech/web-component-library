import { Component, h, Host, Method, State } from "@stencil/core";
import BankAccountFormSkeleton from "./bank-account-form-skeleton";
import { configState, waitForConfig } from "../../config-provider/config-state";

@Component({
  tag: "bank-account-form",
})
export class BankAccountForm {
  @State() isReady: boolean = false;
  @State() iframeOrigin: string;
  @State() tabId: string;

  private accountNumberIframeElement!: HTMLIframeInputElement;
  private routingNumberIframeElement!: HTMLIframeInputElement;

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  componentDidRender() {
    const elements = [
      this.accountNumberIframeElement,
      this.routingNumberIframeElement,
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
        <BankAccountFormSkeleton isReady={this.isReady} />
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
      </Host>
    );
  }
}
