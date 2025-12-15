import { Component, h, Method, State } from "@stencil/core";
import { StyledHost } from "../../../ui-components";
import BankAccountFormSkeleton from "./bank-account-skeleton";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import { generateTabId } from "../../../utils/utils";
import JustifiAnalytics from "../../../api/Analytics";
import { configState, waitForConfig } from "../../config-provider/config-state";

@Component({
  tag: "justifi-bank-account-form",
  shadow: true,
})
export class BankAccountForm {
  @State() iframeOrigin: string;
  @State() isReady: boolean = false;
  @State() tabId: string;

  private accountNumberIframeElement!: HTMLIframeInputElement;
  private routingNumberIframeElement!: HTMLIframeInputElement;

  analytics: JustifiAnalytics;

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
    this.tabId = generateTabId();

    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
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

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Method()
  async validate(): Promise<any> {
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
    return this.accountNumberIframeElement.tokenize(
      clientId,
      paymentMethodMetadata,
      account,
    );
  }

  render() {
    return (
      <StyledHost>
        <BankAccountFormSkeleton isReady={this.isReady} />
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
      </StyledHost>
    );
  }
}
