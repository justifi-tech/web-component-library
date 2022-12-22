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
    const clientKey = 'abc123';
    const paymentMethodMetadata = {};
    const accountId = 'def456';
    const triggerTokenizationSpy = jest.spyOn((paymentMethodForm as any), 'triggerTokenization');

    paymentMethodForm.tokenize(clientKey, paymentMethodMetadata);
    expect(triggerTokenizationSpy).toHaveBeenCalledWith(clientKey, paymentMethodMetadata, undefined);

    paymentMethodForm.tokenize(clientKey, paymentMethodMetadata, accountId);
    expect(triggerTokenizationSpy).toHaveBeenCalledWith(clientKey, paymentMethodMetadata, accountId);
  });
});
