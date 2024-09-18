import { newSpecPage } from '@stencil/core/testing';
import { CardForm } from '../card-form';
import { PaymentMethodForm } from '../../payment-method-form/payment-method-form';
import JustifiAnalytics from '../../../api/Analytics';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
})

describe('justifi-card-form', () => {
  it('should pass validationMode prop to justifi-payment-method-form', async () => {
    const page = await newSpecPage({
      components: [CardForm],
      html: '<justifi-card-form validation-mode="onChange" />',
    });
    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('payment-method-form-validation-mode')).toBe('onChange');
  });

  it('should pass iframeOrigin prop to justifi-payment-method-form', async () => {
    const page = await newSpecPage({
      components: [CardForm],
      html: '<justifi-card-form iframe-origin="https://example.com" />',
    });

    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('iframe-origin')).toBe('https://example.com');
  });

  it('should pass iframeOrigin default prop to justifi-payment-method-form when no prop is provided', async () => {
    const page = await newSpecPage({
      components: [CardForm],
      html: '<justifi-card-form />',
    });

    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('iframe-origin')).toBe(IFRAME_ORIGIN);
  });

  it('should pass singleLine prop to justifi-payment-method-form', async () => {
    const page = await newSpecPage({
      components: [CardForm],
      html: '<justifi-card-form single-line />',
    });
    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('single-line')).toBe('');
  });

  it('should call the PaymentMethodForm validate method when invoked from the CardForm component', async () => {
    const page = await newSpecPage({
      components: [CardForm, PaymentMethodForm],
      html: '<justifi-card-form></justifi-card-form>',
    });

    const component = page.rootInstance;

    const validateMock = jest.fn();
    component.childRef = { validate: validateMock } as any;

    await component.validate();

    expect(validateMock).toHaveBeenCalled();
  });

  it('should call the PaymentMethodForm tokenize method with the right arguments when invoked from the CardForm component', async () => {
    const page = await newSpecPage({
      components: [CardForm, PaymentMethodForm],
      html: '<justifi-card-form></justifi-card-form>',
    });

    const component = page.rootInstance;

    const tokenizeMock = jest.fn();
    component.childRef = { tokenize: tokenizeMock } as any;

    const clientId = 'clientId';
    const paymentMethodMetadata = { paymentMethodType: 'card' };
    const account = 'account';
    const tokenizeArgs = [clientId, paymentMethodMetadata, account];

    await component.tokenize(...tokenizeArgs);

    expect(tokenizeMock).toHaveBeenCalledWith(...tokenizeArgs);
  });
});
