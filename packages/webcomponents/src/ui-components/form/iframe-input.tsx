import { Component, h, Method, Prop, State } from "@stencil/core";
import { FrameCommunicationService } from "../../utils/frame-comunication-service";
import { StyledHost } from "../styled-host/styled-host";
import { FormControlErrorText } from "./form-helpers/form-control-error-text";
import packageJson from '../../../package.json';

@Component({
  tag: "iframe-input",
  shadow: true,
})
export class IframeInput {
  private iframeElement!: HTMLIFrameElement;
  private frameService: FrameCommunicationService;

  @State() isFocused: boolean = false;
  @State() isValid: boolean = true;
  @State() errorText: string;

  @Prop() inputId: string;
  @Prop() label: string;
  @Prop() iframeOrigin: string;

  disconnectedCallback() {
    this.frameService.removeMessageListener(this.dispatchMessageEvent);
  }

  @Method()
  async validate(): Promise<any> {
    const response = await this.frameService
      .postMessageWithResponseListener(
        'validate'
      );

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
    const eventType = 'tokenize';
    return this.frameService.postMessageWithResponseListener(eventType, {
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

  private get fontFamily() {
    return btoa(getComputedStyle(document.body).fontFamily);
  }

  private get part() {
    return `input form-control-text ${this.isFocused ? 'input-focused' : ''} ${!this.isValid ? 'input-invalid' : ''}`;
  }

  render() {
    return (
      <StyledHost exportparts="input,label,input-focused,input-invalid" >
        <div class="form-group d-flex flex-column">
          <label htmlFor="" part="label">{this.label || ''}</label>
          <div part={this.part}>
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
          </div>
          <FormControlErrorText errorText={this.errorText} name={this.inputId} />
        </div>
      </StyledHost>
    );
  }
}
