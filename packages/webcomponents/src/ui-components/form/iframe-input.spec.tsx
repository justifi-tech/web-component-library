import { Component, h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { IframeInput } from './iframe-input';
import { MessageEventType } from '../../components/checkout/message-event-types';

jest.mock('iframe-resizer/js/iframeResizer', () => jest.fn());

@Component({ tag: 'test-shadow-host', shadow: true })
class TestShadowHost {
  render() {
    return (
      <iframe-input
        inputId="cardNumber"
        label="Card number"
        iframeOrigin="https://iframe.test/v2/cardNumber?tabId=t1"
      />
    );
  }
}

describe('iframe-input', () => {
  describe('inside a shadow host', () => {
    let page: SpecPage;
    let host: Element;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [TestShadowHost, IframeInput],
        html: '<test-shadow-host></test-shadow-host>',
      });
      await page.waitForChanges();
      host = page.body.querySelector('test-shadow-host');
    });

    it('creates the iframe as a light-DOM child of the host, so window.frames can see it', () => {
      const iframe = host.querySelector('iframe');

      expect(iframe).not.toBeNull();
      expect(iframe.getAttribute('slot')).toBe('cardNumber');
      expect(iframe.getAttribute('name')).toBe('cardNumber');
      expect(iframe.hasAttribute('id')).toBe(false);
      expect(host.shadowRoot.querySelector('iframe')).toBeNull();
    });

    it('projects it through a real slot inside the ::part(input) wrapper', () => {
      const slot = host.shadowRoot.querySelector('slot[name="cardNumber"]');

      expect(slot).not.toBeNull();
      expect(slot.closest('.form-control')).not.toBeNull();
    });

    it('joins the style params with & when the origin already has a query', () => {
      const src = host.querySelector('iframe').getAttribute('src');

      expect(src.startsWith('https://iframe.test/v2/cardNumber?tabId=t1&')).toBe(true);
      expect(src.split('?')).toHaveLength(2);
    });
  });

  describe('without a shadow host', () => {
    it('appends the iframe inside the wrapper', async () => {
      const page = await newSpecPage({
        components: [IframeInput],
        html: '<iframe-input input-id="CVV" label="CVV" iframe-origin="https://iframe.test/v2/CVV?tabId=t1"></iframe-input>',
      });
      await page.waitForChanges();

      const iframe = page.root.querySelector('.form-control iframe');

      expect(iframe).not.toBeNull();
      expect(iframe.hasAttribute('slot')).toBe(false);
      expect(iframe.getAttribute('name')).toBe('CVV');
    });
  });
/**
   * The hosted field owns the masking; this component's only job is to tell
   * it whether to do it.
   */
  describe('mask handshake', () => {
    const ORIGIN = 'https://iframe.test/v2/cardNumber?tabId=t1';

    const setup = async (attrs = '') => {
      const page = await newSpecPage({
        components: [IframeInput],
        html: `<iframe-input input-id="cardNumber" label="Card number" iframe-origin="${ORIGIN}" ${attrs}></iframe-input>`,
      });
      await page.waitForChanges();

      const instance = page.rootInstance as IframeInput;
      const postMessage = jest.fn();
      // mock-doc builds no contentWindow; the frame service needs only this.
      ((instance as any).iframeElement as any).contentWindow = { postMessage };

      /**
       * What a hosted field posts up once its input is live. mock-doc cannot
       * construct a MessageEvent, so carry the payload on a plain Event.
       */
      const fieldLoaded = async (id: string) => {
        const event: any = new (page.win as any).Event('message');
        event.data = { eventType: 'loaded', data: { id } };
        page.win.dispatchEvent(event);
        await page.waitForChanges();
      };

      return { page, instance, postMessage, fieldLoaded };
    };

    const expectedCall = (enabled: boolean) => [
      { eventType: MessageEventType.setMaskCardNumber, enabled },
      ORIGIN,
    ];

    it('tells the field to mask once that field reports it has loaded', async () => {
      const { postMessage, fieldLoaded } = await setup('mask-card-number="true"');

      await fieldLoaded('cardNumber');

      expect(postMessage).toHaveBeenCalledWith(...expectedCall(true));
    });

    it('tells the field not to mask when the prop is absent', async () => {
      const { postMessage, fieldLoaded } = await setup();

      await fieldLoaded('cardNumber');

      expect(postMessage).toHaveBeenCalledWith(...expectedCall(false));
    });

    it('ignores a loaded message from a different field', async () => {
      const { postMessage, fieldLoaded } = await setup('mask-card-number="true"');

      await fieldLoaded('CVV');

      expect(postMessage).not.toHaveBeenCalled();
    });

    it('re-sends on every load, because the src is swapped once styles arrive', async () => {
      const { postMessage, fieldLoaded } = await setup('mask-card-number="true"');

      await fieldLoaded('cardNumber');
      await fieldLoaded('cardNumber');

      expect(postMessage).toHaveBeenCalledTimes(2);
    });

    it('pushes the new value when the prop changes after load', async () => {
      const { page, postMessage, fieldLoaded } = await setup();

      await fieldLoaded('cardNumber');
      postMessage.mockClear();

      page.root.setAttribute('mask-card-number', 'true');
      await page.waitForChanges();

      expect(postMessage).toHaveBeenCalledWith(...expectedCall(true));
    });

    it('does not push a prop change before the field has loaded', async () => {
      const { page, postMessage } = await setup();

      page.root.setAttribute('mask-card-number', 'true');
      await page.waitForChanges();

      expect(postMessage).not.toHaveBeenCalled();
    });
  });

  /**
   * Every hosted field replies to the same window, so a field's validate()
   * must render its own field's reply, never a sibling's.
   */
  describe('validate', () => {
    let page: SpecPage;

    const field = (id: string) =>
      page.body.querySelector(`iframe-input[input-id="${id}"]`) as HTMLIframeInputElement;

    const errorText = (id: string) =>
      page.body.querySelector(`#form-error-text-${id}`)?.textContent ?? null;

    /** A validate reply posted up by the named field's frame. */
    const validateReply = (id: string, data: any) => {
      const event: any = new (page.win as any).Event('message');
      event.data = { eventType: MessageEventType.validate, data };
      event.source = (page.body.querySelector(`iframe[name="${id}"]`) as any).contentWindow;
      page.win.dispatchEvent(event);
    };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [IframeInput],
        html: `
          <iframe-input input-id="accountNumberConfirmation" label="Confirm Account Number" iframe-origin="https://iframe.test/v2/accountNumberConfirmation"></iframe-input>
          <iframe-input input-id="routingNumber" label="Routing Number" iframe-origin="https://iframe.test/v2/routingNumber"></iframe-input>
        `,
      });
      await page.waitForChanges();

      // mock-doc builds no contentWindow; give each frame a distinct one.
      page.body.querySelectorAll('iframe').forEach((iframe: any) => {
        iframe.contentWindow = { postMessage: jest.fn() };
      });
    });

    it('shows the error under the field that reported it when a sibling replies first', async () => {
      const confirmValidation = field('accountNumberConfirmation').validate();
      // Stencil runs @Methods after a tick; let the listener register.
      await page.waitForChanges();

      validateReply('routingNumber', { isValid: true, error: {} });
      validateReply('accountNumberConfirmation', {
        isValid: false,
        error: { message: 'The entered value does not match the account number' },
      });
      await confirmValidation;
      await page.waitForChanges();

      expect(errorText('accountNumberConfirmation')).toBe(
        'The entered value does not match the account number',
      );
      expect(errorText('routingNumber')).toBeNull();
    });

    it('does not show a sibling error under a field that is still waiting', async () => {
      const routingValidation = field('routingNumber').validate();
      // Stencil runs @Methods after a tick; let the listener register.
      await page.waitForChanges();

      validateReply('accountNumberConfirmation', {
        isValid: false,
        error: { message: 'The entered value does not match the account number' },
      });
      validateReply('routingNumber', { isValid: true, error: {} });
      await routingValidation;
      await page.waitForChanges();

      expect(errorText('routingNumber')).toBeNull();
    });
  });
});

