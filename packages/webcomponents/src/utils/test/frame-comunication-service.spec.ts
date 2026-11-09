import { FrameCommunicationService } from '../frame-comunication-service';

const ORIGIN = 'https://iframe.test';

/** A stand-in for a hosted field's iframe: only contentWindow is read. */
const fakeIframe = () =>
  ({ contentWindow: { postMessage: jest.fn() } }) as unknown as HTMLIFrameElement;

/**
 * What a hosted field posts up to the host page. mock-doc cannot construct a
 * MessageEvent, so carry the payload on a plain Event.
 */
const reply = (from: HTMLIFrameElement, eventType: string, data: any) => {
  const event: any = new Event('message');
  event.data = { eventType, data };
  event.source = from.contentWindow;
  window.dispatchEvent(event);
};

/** Resolves with the settled value, or 'pending' if the promise has not settled. */
const settled = (promise: Promise<any>) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve('pending'), 0))]);

describe('FrameCommunicationService.postMessageWithResponseListener', () => {
  let ownFrame: HTMLIFrameElement;
  let siblingFrame: HTMLIFrameElement;
  let service: FrameCommunicationService;

  beforeEach(() => {
    ownFrame = fakeIframe();
    siblingFrame = fakeIframe();
    service = new FrameCommunicationService(ownFrame, ORIGIN);
  });

  it('posts the request to its own iframe', () => {
    service.postMessageWithResponseListener('validate');

    expect(ownFrame.contentWindow.postMessage).toHaveBeenCalledWith(
      { eventType: 'validate' },
      ORIGIN,
    );
  });

  it('resolves with the reply from its own iframe', async () => {
    const response = service.postMessageWithResponseListener('validate');

    reply(ownFrame, 'validate', { isValid: true, error: {} });

    expect(await response).toEqual({ isValid: true, error: {} });
  });

  it('ignores a reply of the same type from a sibling iframe', async () => {
    const response = service.postMessageWithResponseListener('validate');

    reply(siblingFrame, 'validate', { isValid: false, error: { message: 'sibling error' } });

    expect(await settled(response)).toBe('pending');
  });

  it('takes its own reply when a sibling reply arrives first', async () => {
    const response = service.postMessageWithResponseListener('validate');

    reply(siblingFrame, 'validate', { isValid: true, error: {} });
    reply(ownFrame, 'validate', { isValid: false, error: { message: 'own error' } });

    expect(await response).toEqual({ isValid: false, error: { message: 'own error' } });
  });

  it('ignores a reply of a different type from its own iframe', async () => {
    const response = service.postMessageWithResponseListener('validate');

    reply(ownFrame, 'tokenize', { id: 'pm_123' });

    expect(await settled(response)).toBe('pending');
  });
});
