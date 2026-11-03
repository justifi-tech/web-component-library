/**
 * This approach decouples the communication logic from PaymentMethodForm component,
 * making it cleaner, more maintainable, and easier to test
 */
export class FrameCommunicationService {
  private iframe: HTMLIFrameElement;
  private iframeOrigin: string;

  constructor(iframe: HTMLIFrameElement, iframeOrigin: string) {
    this.iframe = iframe;
    this.iframeOrigin = iframeOrigin;
  }

  postMessage(eventType: string, payload?: any) {
    const message = { eventType, ...payload };
    this.iframe.contentWindow.postMessage(message, this.iframeOrigin);
  }

  addMessageListener(callback: (event: MessageEvent) => void) {
    window.addEventListener('message', callback);
  }

  removeMessageListener(callback: (event: MessageEvent) => void) {
    window.removeEventListener('message', callback);
  }

  postMessageWithResponseListener(
    eventType: string,
    payload?: any
  ): Promise<any> {
    return new Promise((resolve) => {
      const responseListener = (event: MessageEvent) => {
        if (event.data.eventType !== eventType) return;
        window.removeEventListener('message', responseListener);
        resolve(event.data.data);
      };

      window.addEventListener('message', responseListener);
      this.postMessage(eventType, payload);
    });
  }
}
