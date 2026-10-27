import {
  BroadcastHostService,
  BROADCAST_HOST_EVENT_TYPE,
} from './broadcast-host-service';

const IFRAME_URL = 'https://iframe.justifi.ai/v2/cardNumber?tabId=tab-1';
const IFRAME_ORIGIN = 'https://iframe.justifi.ai';

type Target = {
  inputId: string;
  deliverBroadcast: jest.Mock<Promise<void>, [unknown]>;
};

function makeTarget(inputId: string): Target {
  return { inputId, deliverBroadcast: jest.fn().mockResolvedValue(undefined) };
}

function envelope(overrides: Record<string, unknown> = {}) {
  return {
    eventType: BROADCAST_HOST_EVENT_TYPE,
    tabId: 'tab-1',
    sourceId: 'cardNumber',
    payload: { eventType: 'justifi.card.getCVV' },
    ...overrides,
  };
}

function dispatch(data: unknown, origin = IFRAME_ORIGIN) {
  // A plain object, not `new MessageEvent(...)`: mock-doc's dispatchEvent
  // assigns target/currentTarget/etc., all getter-only on a real Event.
  const event = { type: 'message', data, origin, bubbles: false };
  window.dispatchEvent(event as unknown as MessageEvent);
}

describe('BroadcastHostService', () => {
  let targets: Target[];
  let service: BroadcastHostService;

  beforeEach(() => {
    targets = [
      makeTarget('cardNumber'),
      makeTarget('expirationMonth'),
      makeTarget('CVV'),
    ];
    service = new BroadcastHostService(() => targets, 'tab-1', IFRAME_URL);
    service.start();
  });

  afterEach(() => {
    service.stop();
  });

  it('fans an envelope out to every member except the sender', () => {
    const message = envelope();
    dispatch(message);

    expect(targets[0].deliverBroadcast).not.toHaveBeenCalled();
    expect(targets[1].deliverBroadcast).toHaveBeenCalledWith(message);
    expect(targets[2].deliverBroadcast).toHaveBeenCalledWith(message);
  });

  it('passes the envelope through verbatim, nesting intact', () => {
    dispatch(envelope());

    const [delivered] = targets[1].deliverBroadcast.mock.calls[0];
    expect(delivered).toEqual(
      expect.objectContaining({
        payload: { eventType: 'justifi.card.getCVV' },
      })
    );
  });

  it('ignores messages from another origin', () => {
    dispatch(envelope(), 'https://evil.example.com');

    targets.forEach((t) => expect(t.deliverBroadcast).not.toHaveBeenCalled());
  });

  it('ignores another form group on the same page', () => {
    dispatch(envelope({ tabId: 'tab-2' }));

    targets.forEach((t) => expect(t.deliverBroadcast).not.toHaveBeenCalled());
  });

  it('ignores traffic that is not a broadcast envelope', () => {
    dispatch({ eventType: 'tokenize', data: { id: 'cardNumber' } });
    dispatch(undefined);
    dispatch('a string');

    targets.forEach((t) => expect(t.deliverBroadcast).not.toHaveBeenCalled());
  });

  it('resolves targets per message, so late iframes are included', () => {
    const late = makeTarget('expirationYear');
    targets.push(late);

    dispatch(envelope());

    expect(late.deliverBroadcast).toHaveBeenCalled();
  });

  it('stops listening after stop()', () => {
    service.stop();
    dispatch(envelope());

    targets.forEach((t) => expect(t.deliverBroadcast).not.toHaveBeenCalled());
  });
});
