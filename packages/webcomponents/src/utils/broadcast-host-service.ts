/**
 * Safari and iOS below 15.4 have no BroadcastChannel, which is how the hosted
 * field iframes talk to each other. Below that version the card number iframe
 * asks for the expiration and CVV values, nothing answers, and tokenization
 * hangs with no error event.
 *
 * The iframes cannot reach each other directly there, but this document can
 * reach all of them. So it brokers: an iframe posts its broadcast up here
 * wrapped in an envelope, and this fans it out to the other members of the
 * same `tabId` group.
 *
 * Iframes that do have BroadcastChannel never send these envelopes, so on
 * every modern browser this listener sits idle.
 */
export const BROADCAST_HOST_EVENT_TYPE = 'justifi.broadcast';

type BroadcastEnvelope = {
  eventType: typeof BROADCAST_HOST_EVENT_TYPE;
  tabId: string;
  sourceId: string;
  payload: unknown;
};

/**
 * Structural, not `Pick<HTMLIframeInputElement, ...>`: `components.d.ts` is
 * build-generated and gitignored, so a plain .ts file cannot lean on it.
 */
type BroadcastTarget = {
  inputId: string;
  deliverBroadcast: (message: unknown) => Promise<void>;
};

export class BroadcastHostService {
  private getTargets: () => BroadcastTarget[];
  private tabId: string;
  private iframeOrigin: string;

  /**
   * @param getTargets evaluated per message, so iframes that mount or reload
   *   after start() are included.
   * @param iframeOrigin may be a full iframe URL; only its origin is compared.
   */
  constructor(
    getTargets: () => BroadcastTarget[],
    tabId: string,
    iframeOrigin: string
  ) {
    this.getTargets = getTargets;
    this.tabId = tabId;
    this.iframeOrigin = iframeOrigin;
  }

  start() {
    window.addEventListener('message', this.handleMessage);
  }

  stop() {
    window.removeEventListener('message', this.handleMessage);
  }

  private get expectedOrigin(): string | null {
    try {
      return new URL(this.iframeOrigin, window.location.href).origin;
    } catch (_err) {
      return null;
    }
  }

  private handleMessage = (event: MessageEvent) => {
    const envelope = event.data as BroadcastEnvelope | undefined;

    if (!envelope || envelope.eventType !== BROADCAST_HOST_EVENT_TYPE) return;
    if (event.origin !== this.expectedOrigin) return;
    // Each card/bank form generates its own tabId, so two forms on one page
    // never cross-talk.
    if (envelope.tabId !== this.tabId) return;

    this.getTargets()
      // BroadcastChannel never echoes to the sender; neither does this.
      .filter((target) => target && target.inputId !== envelope.sourceId)
      .forEach((target) => {
        target.deliverBroadcast(envelope);
      });
  };
}
