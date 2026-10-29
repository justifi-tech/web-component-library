import { Component, h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { IframeInput } from './iframe-input';

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
});
