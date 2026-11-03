jest.mock('../../../config-provider/config-state', () => ({
  configState: { iframeOrigin: 'https://test-iframe.justifi.ai' },
  waitForConfig: jest.fn().mockResolvedValue(undefined),
}));

import { newSpecPage } from '@stencil/core/testing';
import { BankAccountForm } from '../bank-account-form';
import { checkoutStore } from '../../../../store/checkout.store';

import {
  ComponentErrorCodes,
  ComponentErrorMessages,
  ComponentErrorSeverity,
} from '../../../../api/ComponentError';
import { FormAlert } from '../../../../ui-components/form/form-helpers/form-alert/form-alert';
import { useBridgedFakeTimers } from '../../test/use-bridged-fake-timers';

const RELOAD_BUTTON = 'button[aria-label="Reload bank account form"]';

const DEFAULT_FORM = '<bank-account-form></bank-account-form>';
const CONFIRM_FORM =
  '<bank-account-form show-account-number-confirmation="true"></bank-account-form>';

// iframe-input.validate() resolves { isValid, error } -- never a bare boolean.
const createMockIframeElement = (isValid: boolean) => ({
  validate: jest.fn().mockResolvedValue({ isValid, error: { message: undefined } }),
  addEventListener: jest.fn(),
});

describe('bank-account-form', () => {
  beforeEach(() => {
    checkoutStore.checkoutLoaded = false;
    checkoutStore.achPaymentsEnabled = false;
  });

  describe('iframe rendering', () => {
    const renderCases = [
      {
        name: 'renders the iframes',
        html: '<bank-account-form></bank-account-form>',
        fields: [
          { inputId: 'accountNumber', label: 'Account Number' },
          { inputId: 'routingNumber', label: 'Routing Number' },
        ],
      },
      {
        name: 'renders the confirmation iframe between account and routing number',
        html: '<bank-account-form show-account-number-confirmation="true"></bank-account-form>',
        fields: [
          { inputId: 'accountNumber', label: 'Account Number' },
          { inputId: 'accountNumberConfirmation', label: 'Confirm Account Number' },
          { inputId: 'routingNumber', label: 'Routing Number' },
        ],
      },
    ];

    renderCases.forEach(({ name, html, fields }) => {
      it(name, async () => {
        const page = await newSpecPage({
          components: [BankAccountForm],
          html,
        });

        const iframes = page.root.querySelectorAll('iframe-input');
        const { tabId } = page.rootInstance as BankAccountForm;

        expect(tabId).toEqual(expect.any(String));
        expect(tabId).not.toBe('');
        expect(iframes).toHaveLength(fields.length);

        fields.forEach(({ inputId, label }, index) => {
          expect(iframes[index].getAttribute('inputId')).toBe(inputId);
          expect(iframes[index].getAttribute('label')).toBe(label);
          expect(iframes[index].getAttribute('iframeOrigin')).toBe(
            `https://test-iframe.justifi.ai/v2/${inputId}?tabId=${tabId}`,
          );
        });
      });
    });

    it('omits the confirmation iframe by default', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      expect(
        page.root.querySelector('iframe-input[inputId="accountNumberConfirmation"]'),
      ).toBeNull();
    });

    it('shows an error message and a reload button when the iframe fails to load', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm, FormAlert],
      });
      const restoreTimers = useBridgedFakeTimers();

      try {
        await page.setContent('<bank-account-form></bank-account-form>');

        expect(page.root.querySelector('[role="alert"]')).toBeNull();
        expect(page.root.querySelector(RELOAD_BUTTON)).toBeNull();

        await jest.advanceTimersByTimeAsync(10_000);
        await page.waitForChanges();

        const alert = page.root.querySelector('[role="alert"]');

        expect(alert).not.toBeNull();
        expect(alert.textContent.trim()).toBe(
          ComponentErrorMessages.IFRAME_LOAD_ERROR,
        );

        const reloadButton = page.root.querySelector(RELOAD_BUTTON);

        expect(reloadButton).not.toBeNull();
        expect(reloadButton.textContent.trim()).toBe('Try again');
      } finally {
        restoreTimers();
      }
    });

    it('reloads the iframes when the reload button is clicked', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm, FormAlert],
      });
      const restoreTimers = useBridgedFakeTimers();

      try {
        await page.setContent('<bank-account-form></bank-account-form>');

        // iframe-input is not registered in this spec page, so reload() does not exist
        // on the rendered elements — stub it on the real nodes the component's refs hold.
        const iframes = Array.from(page.root.querySelectorAll('iframe-input'));
        iframes.forEach((element) => (element.reload = jest.fn().mockResolvedValue(undefined)));

        // Trip the 10s load deadline to reach the error state.
        await jest.advanceTimersByTimeAsync(10_000);
        await page.waitForChanges();

        const reloadButton = page.root.querySelector(RELOAD_BUTTON) as HTMLButtonElement;

        expect(reloadButton).not.toBeNull();

        reloadButton.click();
        await page.waitForChanges();

        expect(iframes).toHaveLength(2);
        iframes.forEach((element) => expect(element.reload).toHaveBeenCalledTimes(1));

        expect((page.rootInstance as BankAccountForm).iframeState).toBe('loading');
        expect(page.root.querySelector('[role="alert"]')).toBeNull();
        expect(page.root.querySelector(RELOAD_BUTTON)).toBeNull();
      } finally {
        (page.rootInstance as BankAccountForm).disconnectedCallback();
        restoreTimers();
      }
    });

    it('emits an error event when the iframe fails to load', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
      });
      const restoreTimers = useBridgedFakeTimers();
      const onError = jest.fn();

      try {
        await page.setContent('<bank-account-form></bank-account-form>');
        page.root.addEventListener('error-event', onError);

        await jest.advanceTimersByTimeAsync(9_999);
        expect(onError).not.toHaveBeenCalled();

        await jest.advanceTimersByTimeAsync(1);
        await page.waitForChanges();

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0].detail).toEqual({
          errorCode: ComponentErrorCodes.IFRAME_LOAD_ERROR,
          message: ComponentErrorMessages.IFRAME_LOAD_ERROR,
          severity: ComponentErrorSeverity.ERROR,
          data: {
            errorMessage: expect.stringContaining('Iframes failed to load:'),
          },
        });

        await jest.advanceTimersByTimeAsync(10_000);
        expect(onError).toHaveBeenCalledTimes(1);
      } finally {
        page.root.removeEventListener('error-event', onError);
        (page.rootInstance as BankAccountForm).disconnectedCallback();
        restoreTimers();
      }
    });
  });

  describe('validate', () => {
    const mountWithMocks = async (html: string, validity: Record<string, boolean>) => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html,
      });

      const instance = page.rootInstance as any;
      instance.accountNumberIframeElement = createMockIframeElement(validity.accountNumber);
      instance.routingNumberIframeElement = createMockIframeElement(validity.routingNumber);
      if ('accountNumberConfirmation' in validity) {
        instance.accountNumberConfirmationIframeElement =
          createMockIframeElement(validity.accountNumberConfirmation);
      }

      return instance;
    };

    it('returns isValid true when all iframe fields are valid', async () => {
      const instance = await mountWithMocks(DEFAULT_FORM, {
        accountNumber: true,
        routingNumber: true,
      });

      expect(await instance.validate()).toEqual({ isValid: true });
    });

    it('returns isValid false when the routing number is invalid', async () => {
      const instance = await mountWithMocks(DEFAULT_FORM, {
        accountNumber: true,
        routingNumber: false,
      });

      expect(await instance.validate()).toEqual({ isValid: false });
    });

    it('returns isValid false when the account number is invalid', async () => {
      const instance = await mountWithMocks(DEFAULT_FORM, {
        accountNumber: false,
        routingNumber: true,
      });

      expect(await instance.validate()).toEqual({ isValid: false });
    });

    it('does not validate the confirmation field when the prop is off', async () => {
      const instance = await mountWithMocks(DEFAULT_FORM, {
        accountNumber: true,
        routingNumber: true,
        accountNumberConfirmation: false,
      });

      expect(await instance.validate()).toEqual({ isValid: true });
      expect(
        instance.accountNumberConfirmationIframeElement.validate,
      ).not.toHaveBeenCalled();
    });

    it('returns isValid false when the confirmation field does not match', async () => {
      const instance = await mountWithMocks(CONFIRM_FORM, {
        accountNumber: true,
        routingNumber: true,
        accountNumberConfirmation: false,
      });

      expect(await instance.validate()).toEqual({ isValid: false });
      expect(
        instance.accountNumberConfirmationIframeElement.validate,
      ).toHaveBeenCalledTimes(1);
    });

    it('returns isValid true when every field including the confirmation is valid', async () => {
      const instance = await mountWithMocks(CONFIRM_FORM, {
        accountNumber: true,
        routingNumber: true,
        accountNumberConfirmation: true,
      });

      expect(await instance.validate()).toEqual({ isValid: true });
    });

    it('returns isValid false when a field has not rendered yet', async () => {
      const instance = await mountWithMocks(CONFIRM_FORM, {
        accountNumber: true,
        routingNumber: true,
        accountNumberConfirmation: true,
      });
      instance.accountNumberConfirmationIframeElement = undefined;

      await expect(instance.validate()).resolves.toEqual({ isValid: false });
      expect(instance.accountNumberIframeElement.validate).not.toHaveBeenCalled();
    });
  });

  describe('tokenize', () => {
    const TOKENIZE_ARGS = { clientId: 'c', paymentMethodMetadata: {} };

    const mountForTokenize = async (html: string, confirmationIsValid: boolean) => {
      const page = await newSpecPage({ components: [BankAccountForm], html });

      const instance = page.rootInstance as any;
      instance.accountNumberIframeElement = {
        ...createMockIframeElement(true),
        tokenize: jest.fn().mockResolvedValue({ data: { bank_account: { token: 'tok_1' } } }),
      };
      instance.routingNumberIframeElement = createMockIframeElement(true);
      instance.accountNumberConfirmationIframeElement =
        createMockIframeElement(confirmationIsValid);

      return instance;
    };

    it('does not check the confirmation field when the prop is off', async () => {
      const instance = await mountForTokenize(DEFAULT_FORM, false);

      const result = await instance.tokenize(TOKENIZE_ARGS);

      expect(result.data.bank_account.token).toBe('tok_1');
      expect(
        instance.accountNumberConfirmationIframeElement.validate,
      ).not.toHaveBeenCalled();
    });

    it('refuses to tokenize when the confirmation field does not match', async () => {
      const instance = await mountForTokenize(CONFIRM_FORM, false);

      const result = await instance.tokenize(TOKENIZE_ARGS);

      expect(instance.accountNumberIframeElement.tokenize).not.toHaveBeenCalled();
      expect(result.error.code).toBe('validation_error');
      expect(result.error.message).toBe(
        'The entered value does not match the account number',
      );
    });

    it('refuses to tokenize when the confirmation field has not rendered', async () => {
      const instance = await mountForTokenize(CONFIRM_FORM, true);
      instance.accountNumberConfirmationIframeElement = undefined;

      const result = await instance.tokenize(TOKENIZE_ARGS);

      expect(instance.accountNumberIframeElement.tokenize).not.toHaveBeenCalled();
      expect(result.error.code).toBe('validation_error');
    });

    it('tokenizes when the confirmation field matches', async () => {
      const instance = await mountForTokenize(CONFIRM_FORM, true);

      const result = await instance.tokenize(TOKENIZE_ARGS);

      expect(
        instance.accountNumberConfirmationIframeElement.validate,
      ).toHaveBeenCalledTimes(1);
      expect(instance.accountNumberIframeElement.tokenize).toHaveBeenCalledTimes(1);
      expect(result.data.bank_account.token).toBe('tok_1');
    });
  });

  describe('when ACH is disabled for checkout', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.achPaymentsEnabled = false;
    });

    it('renders nothing and logs a warning once', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      await page.waitForChanges();

      expect(page.root?.innerHTML).toBe('');
      expect(warnSpy).toHaveBeenCalledWith(
        '[bank-account-form] ACH payments are disabled for this checkout (payment_settings.ach_payments=false).'
      );
      warnSpy.mockRestore();
    });

    it('validate returns isValid false', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      await page.waitForChanges();

      const instance = page.rootInstance as any;
      const result = await instance.validate();

      expect(result).toEqual({ isValid: false });
    });

    it('tokenize returns an error object', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      await page.waitForChanges();

      const instance = page.rootInstance as any;
      const result = await instance.tokenize({
        clientId: 'c',
        paymentMethodMetadata: {},
      });

      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('ACH payments are disabled');
    });
  });
});
