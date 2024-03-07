import { newSpecPage } from '@stencil/core/testing';
import { BankAccountForm } from '../bank-account-form';
import { PaymentMethodForm } from '../../payment-method-form/payment-method-form';
import { config } from '../../../../config';

describe('justifi-bank-account-form', () => {
  it('should pass validationMode prop to justifi-payment-method-form', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm],
      html: '<justifi-bank-account-form validation-mode="onChange" />',
    });
    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('payment-method-form-validation-mode')).toBe('onChange');
  });

  it('should pass iframeOrigin prop to justifi-payment-method-form', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm],
      html: '<justifi-bank-account-form iframe-origin="https://example.com" />',
    });

    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('iframe-origin')).toBe('https://example.com');
  });

  it('should pass iframeOrigin default prop to justifi-payment-method-form when no prop is provided', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm],
      html: '<justifi-bank-account-form />',
    });

    const paymentMethodForm = page.root.querySelector('justifi-payment-method-form');
    expect(paymentMethodForm.getAttribute('iframe-origin')).toBe(config.iframeOrigin);
  });

  it('should call the PaymentMethodForm validate method when invoked from the BankAccountForm component', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm, PaymentMethodForm],
      html: '<justifi-bank-account-form></justifi-bank-account-form>',
    });

    const component = page.rootInstance;

    const validateMock = jest.fn();
    component.childRef = { validate: validateMock } as any;

    await component.validate();

    expect(validateMock).toHaveBeenCalled();
  });

  it('should call the PaymentMethodForm tokenize method with the right arguments when invoked from the BankAccountForm component', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm, PaymentMethodForm],
      html: '<justifi-bank-account-form></justifi-bank-account-form>',
    });

    const component = page.rootInstance;

    const tokenizeMock = jest.fn();
    component.childRef = { tokenize: tokenizeMock } as any;

    const clientId = 'clientId';
    const paymentMethodMetadata = { paymentMethodType: 'bankAccount' };
    const account = 'account';
    const tokenizeArgs = [clientId, paymentMethodMetadata, account];

    await component.tokenize(...tokenizeArgs);

    expect(tokenizeMock).toHaveBeenCalledWith(...tokenizeArgs);
  });
});
