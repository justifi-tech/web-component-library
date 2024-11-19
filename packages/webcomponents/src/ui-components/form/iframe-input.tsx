import { Component, Element, h, Host, Method, Prop, State } from "@stencil/core";
import { FrameCommunicationService } from "../../utils/frame-comunication-service";
import { FormControlErrorText } from "./form-helpers/form-control-error-text";
import packageJson from '../../../package.json';
import { MessageEventType } from "../../components/payment-method-form/message-event-types";

@Component({
  tag: "iframe-input",
})
export class IframeInput {
  private iframeElement!: HTMLIFrameElement;
  private frameService: FrameCommunicationService;
  private hiddenInput!: HTMLInputElement;

  @Element() el: HTMLElement;

  @State() isFocused: boolean = false;
  @State() isValid: boolean = true;
  @State() errorText: string;
  @State() fontFamily: string;

  @Prop() inputId: string;
  @Prop() label: string;
  @Prop() iframeOrigin: string;

  componentDidLoad() {
    this.setFontFamily();
  }

  disconnectedCallback() {
    this.frameService.removeMessageListener(this.dispatchMessageEvent);
  }

  @Method()
  async validate(): Promise<any> {
    const response = await this.frameService
      .postMessageWithResponseListener(MessageEventType.paymentMethod.validate);

    this.isValid = response.isValid;

    this.errorText = response.error.message;

    return response;
  }

  @Method()
  async tokenize(
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  ) {
    return this.frameService.postMessageWithResponseListener(MessageEventType.paymentMethod.tokenize, {
      clientId,
      paymentMethodMetadata,
      account,
      componentVersion: packageJson.version,
    });
  }

  private initializeFrameCommunicationService() {
    this.frameService = new FrameCommunicationService(
      this.iframeElement, this.iframeOrigin
    );
    this.frameService?.addMessageListener(this.dispatchMessageEvent);
  }

  private dispatchMessageEvent = (event: MessageEvent) => {
    const { eventType, data } = event.data;
    if (data?.id !== this.inputId) {
      return;
    }

    if (eventType === 'focused') {
      this.isFocused = true;
    }

    if (eventType === 'blurred') {
      this.isFocused = false;
    }
  }

  private get part() {
    return `input form-control-text ${this.isFocused ? 'input-focused' : ''} ${!this.isValid ? 'input-invalid' : ''}`;
  }

  private setFontFamily() {
    this.hiddenInput = this.el.querySelector('input');
    this.fontFamily = getComputedStyle(this.hiddenInput).fontFamily;
    // btoa is used to encode long font-family strings so it can be passed to the iframe
    this.fontFamily = btoa(this.fontFamily);
  }

  render() {
    return (
      <Host class="form-group d-flex flex-column">
        {/* hidden input with bootstrap styles so we can get the computed fontFamily and pass it to the iframe */}
        <input ref={el => this.hiddenInput = el} type="text" class="form-control" style={{ display: 'none' }} />
        <label htmlFor="" part="label">{this.label || ''}</label>
        <div part={this.part}>
          {this.fontFamily ? (
            <iframe
              id={this.inputId}
              name={this.inputId}
              src={this.iframeOrigin + `?fontFamily=${this.fontFamily}`}
              ref={el => {
                this.iframeElement = el as HTMLIFrameElement;
                this.initializeFrameCommunicationService();
              }}
              height="100%"
              width="100%"
            />
          ) : null}
        </div>
        <FormControlErrorText errorText={this.errorText} name={this.inputId} />
      </Host>
    );
  }
}
