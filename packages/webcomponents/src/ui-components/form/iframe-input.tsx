import { Component, Element, h, Host, Method, Prop, State } from "@stencil/core";
import { FrameCommunicationService } from "../../utils/frame-comunication-service";
import { FormControlErrorText } from "./form-helpers/form-control-error-text";
import packageJson from '../../../package.json';
import { iframeInputStyles } from "./iframe-input-styles-state";
import { MessageEventType } from "../../components/checkout/message-event-types";

@Component({
  tag: "iframe-input",
})
export class IframeInput {
  private iframeElement!: HTMLIFrameElement;
  private frameService: FrameCommunicationService;

  @Element() el: HTMLElement;

  @State() isFocused: boolean = false;
  @State() isValid: boolean = true;
  @State() errorText: string;
  @State() fontFamily: string = 'Arial';

  @Prop() inputId: string;
  @Prop() label: string;
  @Prop() iframeOrigin: string;

  disconnectedCallback() {
    this.frameService.removeMessageListener(this.dispatchMessageEvent);
  }

  @Method()
  async validate(): Promise<any> {
    const response = await this.frameService
      .postMessageWithResponseListener(MessageEventType.validate);

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
    return this.frameService.postMessageWithResponseListener(MessageEventType.tokenize, {
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

  private get style() {
    if (this.isFocused) {
      if (!this.isValid) {
        return iframeInputStyles.focusedAndInvalid;
      }
      return iframeInputStyles.focused;
    }
    return null;
  }

  render() {
    return (
      <Host class="form-group d-flex flex-column">
        <label
          class="form-label"
          htmlFor=""
          part="label"
          style={{ height: '20px', minHeight: '20px' }}
        >
          {this.label || ''}
        </label>
        <div
          class={`form-control ${this.isValid ? '' : 'is-invalid'}`}
          part={this.part}
          style={{ ...this.style, overflow: 'hidden' }}
        >
          {this.fontFamily ? (
            <iframe
              id={this.inputId}
              name={this.inputId}
              src={this.iframeOrigin + `?fontFamily=${this.fontFamily}`}
              ref={el => {
                this.iframeElement = el as HTMLIFrameElement;
                this.initializeFrameCommunicationService();
              }}
              height="20px"
              width="100%"
            />
          ) : null}
        </div>
        <FormControlErrorText errorText={this.errorText} name={this.inputId} />
      </Host>
    );
  }
}
