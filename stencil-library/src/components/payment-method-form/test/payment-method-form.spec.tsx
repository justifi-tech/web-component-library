import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentMethodForm } from '../payment-method-form';

describe('justifi-payment-method-form', () => {
  it('renders an iframe', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='card'></justifi-payment-method-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe id='justifi-payment-method-form-card' src='${process.env.IFRAME_ORIGIN}/card'></iframe>
    </justifi-payment-method-form>
  `);
  });

  it('renders a card iframe when paymentMethodFormType is card', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='card'></justifi-payment-method-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe id='justifi-payment-method-form-card' src='${process.env.IFRAME_ORIGIN}/card'></iframe>
    </justifi-payment-method-form>
  `);
  });

  it('renders a bank iframe when paymentMethodFormType is bank', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='bankAccount'></justifi-payment-method-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe id='justifi-payment-method-form-bankAccount' src='${process.env.IFRAME_ORIGIN}/bankAccount'></iframe>
    </justifi-payment-method-form>
  `);
  });

  it('renders a card iframe with validationMode when paymentMethodFormType is card and paymentMethodFormValidationMode is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='bankAccount' paymentMethodFormValidationMode='onChange'></justifi-payment-method-form>,
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-bankAccount' src='${process.env.IFRAME_ORIGIN}/bankAccount?validationMode=onChange'></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('renders a card iframe with validationMode when paymentMethodFormType is card and paymentMethodFormValidationMode is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='bankAccount' paymentMethodFormValidationMode='onBlur'></justifi-payment-method-form>,
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-bankAccount' src='${process.env.IFRAME_ORIGIN}/bankAccount?validationMode=onBlur'></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('renders a card iframe with iframeOrigin when paymentMethodFormType is card and iframeOrigin is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='card' iframeOrigin='${process.env.IFRAME_ORIGIN}'></justifi-payment-method-form>,
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-card' src='${process.env.IFRAME_ORIGIN}/card'></iframe>
      </justifi-payment-method-form>
    `);
  });

  it('renders a card iframe with singleLine when paymentMethodFormType is card and singleLine is set', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => <justifi-payment-method-form paymentMethodFormType='card' singleLine={true}></justifi-payment-method-form>,
    });

    expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-card' src='${process.env.IFRAME_ORIGIN}/card?singleLine=true'></iframe>
      </justifi-payment-method-form>
    `);
  });
});
