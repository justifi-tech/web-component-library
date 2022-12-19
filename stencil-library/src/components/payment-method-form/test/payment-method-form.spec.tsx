import { newSpecPage } from '@stencil/core/testing';
import { PaymentMethodForm } from '../payment-method-form';

describe('justifi-payment-method-form', () => {
  it('renders an iframe', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      html: `<justifi-payment-method-form></justifi-payment-method-form>`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id="justifi-payment-method-form"></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('has a tokenize method which calls triggerTokenization', async () => {
    const paymentMethodForm = new PaymentMethodForm();
    expect(paymentMethodForm.tokenize).toBeDefined();

    const triggerTokenizationSpy = jest.spyOn((paymentMethodForm as any), 'triggerTokenization');
    paymentMethodForm.tokenize('abc123', {});
    expect(triggerTokenizationSpy).toHaveBeenCalled();
  });

  it('has a triggerTokenization method which sends a message via postMessage to iframe', async () => {
    const paymentMethodForm = new PaymentMethodForm();
    expect(paymentMethodForm.tokenize).toBeDefined();

    // mock iframe
    paymentMethodForm.iframeElement = document.createElement('iframe');
    paymentMethodForm.iframeElement.contentWindow.postMessage = () => { };

    const postMessageSpy = jest.spyOn((paymentMethodForm.iframeElement as any), 'contentWindow.postMessage');
    expect(postMessageSpy).toHaveBeenCalledWith('');
  });
});
