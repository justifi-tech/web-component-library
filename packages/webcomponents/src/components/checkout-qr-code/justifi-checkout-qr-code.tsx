import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import QRCode from 'qrcode';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';

@Component({
  tag: 'justifi-checkout-qr-code',
})
export class JustifiCheckoutQrCode {
  @Element() el: HTMLElement;
  @Prop() checkoutId!: string;
  @Prop() size: number = 256;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;
  private qrContainerEl: HTMLDivElement;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
  }

  componentDidLoad() {
    this.renderQrCode();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Watch('checkoutId')
  @Watch('size')
  propChanged() {
    this.renderQrCode();
  }

  private get checkoutUrl(): string {
    return `https://components.justifi.ai/hosted-checkout/${this.checkoutId}`;
  }

  private async renderQrCode() {
    if (!this.checkoutId) {
      this.errorEvent.emit({
        message: 'checkoutId is required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }
    if (!this.qrContainerEl) return;
    const svg = await QRCode.toString(this.checkoutUrl, {
      type: 'svg',
      width: this.size,
      errorCorrectionLevel: 'M',
    });
    this.qrContainerEl.innerHTML = svg;
  }

  render() {
    if (!this.checkoutId) return null;
    return (
      <div ref={(el) => (this.qrContainerEl = el as HTMLDivElement)} />
    );
  }
}
