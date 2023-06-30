import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentMethodForm } from '../payment-method-form';

describe('justifi-payment-method-form', () => {
  it('renders an iframe', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType="card" iframeOrigin="https://js.justifi.ai/v2"></justifi-payment-method-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe height="55" id="justifi-payment-method-form-card" src="https://js.justifi.ai/v2/card"></iframe>
    </justifi-payment-method-form>
  `);
  });

  it('renders a card iframe when paymentMethodFormType is card', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType="card" iframeOrigin="https://js.justifi.ai/v2"></justifi-payment-method-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe height="55" id="justifi-payment-method-form-card" src="https://js.justifi.ai/v2/card"></iframe>
    </justifi-payment-method-form>
  `);
  });

  it('renders a bank iframe when paymentMethodFormType is bank', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType="bankAccount" iframeOrigin="https://js.justifi.ai/v2"></justifi-payment-method-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe height="55" id="justifi-payment-method-form-bankAccount" src="https://js.justifi.ai/v2/bankAccount"></iframe>
    </justifi-payment-method-form>
  `);
  });

  it('renders a card iframe with validationMode when paymentMethodFormType is card and paymentMethodFormValidationMode is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => (
        <justifi-payment-method-form
          paymentMethodFormType="bankAccount"
          paymentMethodFormValidationMode="onChange"
          iframeOrigin="https://js.justifi.ai/v2"
        ></justifi-payment-method-form>
      ),
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe height="55" id="justifi-payment-method-form-bankAccount" src="https://js.justifi.ai/v2/bankAccount?validationMode=onChange"></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('renders a card iframe with validationMode when paymentMethodFormType is card and paymentMethodFormValidationMode is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => (
        <justifi-payment-method-form
          paymentMethodFormType="bankAccount"
          paymentMethodFormValidationMode="onBlur"
          iframeOrigin="https://js.justifi.ai/v2"
        ></justifi-payment-method-form>
      ),
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe height="55" id="justifi-payment-method-form-bankAccount" src="https://js.justifi.ai/v2/bankAccount?validationMode=onBlur"></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('renders a card iframe with iframeOrigin when paymentMethodFormType is card and iframeOrigin is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType="card" iframeOrigin="https://js.justifi.ai/v2"></justifi-payment-method-form>,
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe height="55" id="justifi-payment-method-form-card" src="https://js.justifi.ai/v2/card"></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('renders a card iframe with singleLine when paymentMethodFormType is card and singleLine is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType="card" singleLine={true} iframeOrigin="https://js.justifi.ai/v2"></justifi-payment-method-form>,
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe height="55" id="justifi-payment-method-form-card" src="https://js.justifi.ai/v2/card?singleLine=true"></iframe>
      </justifi-payment-method-form>
    `);
  });
});
