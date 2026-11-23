import { newSpecPage } from '@stencil/core/testing';
import { FormControlText } from '../../ui-components/form/form-control-text';
import { IframeInput } from '../../ui-components/form/iframe-input';

/**
 * The source scan in event-containment.spec.ts proves the decorators are
 * declared correctly. This proves the declaration does what we think it does:
 * the event fires on its own element and gets no further.
 */
const cases = [
  {
    label: 'iframe-input (light DOM)',
    component: IframeInput,
    html: '<iframe-input input-id="cardNumber" label="Card Number" iframe-origin="http://localhost/v2/cardNumber"></iframe-input>',
    emitter: 'iframeLoaded',
    eventName: 'iframe-loaded',
  },
] as const;

describe('contained events at runtime', () => {
  it.each(cases.map((c) => [c.label, c] as const))(
    '%s keeps its event off the host page',
    async (_label, testCase) => {
      const page = await newSpecPage({
        components: [testCase.component as any],
        html: testCase.html,
      });

      const onElement = jest.fn();
      const onDocument = jest.fn();
      const onWindow = jest.fn();
      page.root.addEventListener(testCase.eventName, onElement);
      page.doc.addEventListener(testCase.eventName, onDocument);
      page.win.addEventListener(testCase.eventName, onWindow);

      (page.rootInstance as any)[testCase.emitter].emit({});
      await page.waitForChanges();

      // the emitter really fired — without this the assertions below are vacuous
      expect(onElement).toHaveBeenCalledTimes(1);
      expect(onDocument).not.toHaveBeenCalled();
      expect(onWindow).not.toHaveBeenCalled();
    }
  );

  it('still lets a public event reach the document', async () => {
    const page = await newSpecPage({
      components: [FormControlText],
      html: '<form-control-text label="Email" name="email"></form-control-text>',
    });

    const onDocument = jest.fn();
    page.doc.addEventListener('error-event', onDocument);

    page.root.dispatchEvent(
      new CustomEvent('error-event', { detail: {}, bubbles: true, composed: true })
    );
    await page.waitForChanges();

    expect(onDocument).toHaveBeenCalledTimes(1);
  });
});
