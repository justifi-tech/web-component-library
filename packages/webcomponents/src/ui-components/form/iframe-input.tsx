import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from "@stencil/core";
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import { FrameCommunicationService } from "../../utils/frame-comunication-service";
import { FormControlErrorText } from "./form-helpers/form-control-error-text";
import packageJson from '../../../package.json';
import { iframeInputStyles } from "./iframe-input-styles-state";
import { MessageEventType } from "../../components/checkout/message-event-types";
import { input, inputFocused, inputInvalid, inputInvalidAndFocused, label } from "../../styles/parts";
import { IPaymentMethodMetadata } from "../../api/PaymentMethod";

@Component({
  tag: "iframe-input",
})
export class IframeInput {
  private iframeElement!: HTMLIFrameElement;
  private frameService: FrameCommunicationService;

  @Element() el: HTMLElement;

  @Event() iframeLoaded: EventEmitter<void>;

  @State() isFocused: boolean = false;
  @State() isValid: boolean = true;
  @State() errorText: string;

  @Prop() inputId!: string;
  @Prop() label!: string;
  @Prop() iframeOrigin!: string;

  private wrapperElement!: HTMLDivElement;

  /**
   * The <iframe> is created in the LIGHT DOM of the nearest shadow host and
   * projected into this component through a named <slot>. A slotted element
   * stays in the document tree, so it is a document-tree child navigable and
   * `window.parent.frames[name]` resolves it from a sibling iframe. An iframe
   * rendered inside a shadow tree is invisible to `window.frames` (HTML spec:
   * document-tree child navigables exclude shadow trees). The ::part wrappers
   * stay in the shadow tree, so the theming API is untouched.
   */
  componentDidLoad() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('name', this.inputId);
    iframe.setAttribute('width', '100%');
    // Light-DOM element: merchant CSS reaches it, so pin the box inline.
    iframe.style.border = '0';
    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.boxSizing = 'border-box';
    iframe.addEventListener('load', () => {
      iFrameResize({
        log: false,
        onResized: () => {
          this.iframeLoaded.emit();
        }
      }, iframe);
    });
    this.iframeElement = iframe;
    this.initializeFrameCommunicationService();

    iframe.setAttribute('src', this.iframeSrc);
    this.mountIframe();
  }

  /**
   * Stencil runs componentDidLoad once per instance; a DOM move (framework
   * reparenting, list reorder) fires disconnected → connected on the same
   * instance, so the iframe has to be put back by hand.
   */
  connectedCallback() {
    if (this.iframeElement && !this.iframeElement.isConnected) {
      this.frameService?.addMessageListener(this.dispatchMessageEvent);
      this.mountIframe();
    }
  }

  private mountIframe() {
    const root = this.el.getRootNode() as Node & { host?: Element };
    // Duck-typed: ShadowRoot is not a global in Stencil's mock-doc.
    const host = root.nodeType === 11 && root.host ? root.host : null;
    const iframe = this.iframeElement;

    if (host) {
      if (host.getRootNode() !== document) {
        // A host nested in another shadow tree keeps the iframe out of the
        // document tree; sibling fields fall back to BroadcastChannel.
        console.warn(`[justifi] hosted field "${this.inputId}" is inside a nested shadow tree; window.frames cannot reach it`);
      }
      // Real <slot> element, not JSX: Stencil's slot polyfill for shadow:false
      // components would otherwise replace it with a virtual slot.
      if (!this.wrapperElement.querySelector(`slot[name="${this.inputId}"]`)) {
        const slot = document.createElement('slot');
        slot.name = this.inputId;
        this.wrapperElement.appendChild(slot);
      }
      iframe.setAttribute('slot', this.inputId);
      host.appendChild(iframe);
    } else {
      iframe.removeAttribute('slot');
      this.wrapperElement.appendChild(iframe);
    }
  }

  componentDidRender() {
    // iframeSrc depends on the iframeInputStyles store, which is filled after
    // first paint; keep the light-DOM iframe in sync like the old JSX src did.
    if (this.iframeElement && this.iframeElement.getAttribute('src') !== this.renderedSrc) {
      this.iframeElement.setAttribute('src', this.renderedSrc);
    }
  }

  disconnectedCallback() {
    // Stencil defers this call; on a DOM move the element is already back in
    // the document (its light-DOM iframe moved with the host), so leave it be.
    if (this.el.isConnected) return;
    this.frameService?.removeMessageListener(this.dispatchMessageEvent);
    (this.iframeElement as any)?.iFrameResizer?.removeListeners?.();
    this.iframeElement?.remove();
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
    paymentMethodMetadata: IPaymentMethodMetadata,
    account?: string,
  ) {
    return this.frameService.postMessageWithResponseListener(MessageEventType.tokenize, {
      clientId,
      paymentMethodMetadata,
      account,
      componentVersion: packageJson.version,
    });
  }

  @Method()
  async reload() {
    this.iframeElement.src = this.iframeSrc;
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
    if (this.isFocused && !this.isValid) {
      return inputInvalidAndFocused;
    }

    if (!this.isValid) {
      return inputInvalid;
    }

    if (this.isFocused) {
      return inputFocused;
    }

    return input;
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

  private get urlParams() {
    // map the iframeInputStyles.fontStyles properties to the urlParams 
    // and encode each property with btoa
    const encodedObject = Object.fromEntries(
      Object
        .entries(iframeInputStyles.fontStyles)
        .map(([key, value]) => [key, btoa(String(value))])
    );

    const params = new URLSearchParams(encodedObject).toString();

    return params;
  }

  private get iframeSrc() {
    // iframeOrigin already carries ?tabId=…; a second '?' would fold the
    // style params into the tabId value on the iframe side.
    const separator = this.iframeOrigin.includes('?') ? '&' : '?';
    return `${this.iframeOrigin}${separator}${this.urlParams}`;
  }

  private renderedSrc: string;

  render() {
    this.renderedSrc = this.iframeSrc;
    return (
      <Host class="form-group d-flex flex-column">
        <div style={{
          visibility: this.iframeLoaded ? 'visible' : 'hidden',
          height: this.iframeLoaded ? 'auto' : '0',
        }}>
          <label
            class="form-label"
            htmlFor=""
            part={label}
          >
            {this.label || ''}
          </label>
          {/* Keep this div childless in JSX: mountIframe() appends the real
              <slot> (or the iframe) to it, and vdom children would clobber it. */}
          <div
            ref={el => (this.wrapperElement = el as HTMLDivElement)}
            class={`p-0 d-flex form-control ${this.isValid ? '' : 'is-invalid'}`}
            part={this.part}
            style={{
              ...this.style,
              overflow: 'hidden',
            }}
          >
          </div>
          <FormControlErrorText errorText={this.errorText} name={this.inputId} />
        </div>
      </Host>
    );
  }
}
