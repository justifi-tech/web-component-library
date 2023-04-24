import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentMethodForm } from '../payment-method-form';

describe('justifi-payment-method-form', () => {
  it('renders an iframe', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => (<justifi-payment-method-form paymentMethodFormType="card"></justifi-payment-method-form>),
    });
    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe height="55" id="justifi-payment-method-form-card" src="https://js.justifi.ai/v2/card"></iframe>
      </justifi-payment-method-form>
    `);
  });

  // it('has a tokenize method which calls triggerTokenization', async () => {
  //   const paymentMethodForm = new PaymentMethodForm();
  //   expect(paymentMethodForm.tokenize).toBeDefined();
  //   const clientId = 'abc123';
  //   const paymentMethodMetadata = {};
  //   const accountId = 'def456';
  //   const tokenizeSpy = jest.spyOn(paymentMethodForm, 'tokenize');

  //   paymentMethodForm.tokenize(clientId, paymentMethodMetadata);
  //   expect(tokenizeSpy).toHaveBeenCalledWith(clientId, paymentMethodMetadata, undefined);

  //   paymentMethodForm.tokenize(clientId, paymentMethodMetadata, accountId);
  //   expect(tokenizeSpy).toHaveBeenCalledWith(clientId, paymentMethodMetadata, accountId);
  // });
});
