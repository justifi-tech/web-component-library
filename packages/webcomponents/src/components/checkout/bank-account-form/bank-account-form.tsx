import { Component, h, Host, Method, Prop, Event, EventEmitter, State } from "@stencil/core";
import Skeleton from "../../../ui-components/skeleton";

@Component({
  tag: "bank-account-form",
})
export class BankAccountForm {
  @Prop() iframeOrigin: string;

  @Event({ eventName: 'ready-event' }) eventReady: EventEmitter<void>;

  @State() isReady: boolean = false;

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
      this.eventReady.emit();
    });
  }

  bankAccountFormSkeleton = () => {
    return (
      <div class="container-fluid p-0">
        <div class="row mb-3">
          <div class="col-12 align-content-end">
            <Skeleton height="18px" width="120px" />
            <Skeleton height="36px" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 align-content-end">
            <Skeleton height="18px" width="110px" />
            <Skeleton height="36px" />
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Host>
        {!this.isReady && this.bankAccountFormSkeleton()}
        <div class="container-fluid p-0" style={{
          opacity: this.isReady ? '1' : '0',
          height: this.isReady ? 'auto' : '0',
        }}>
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
