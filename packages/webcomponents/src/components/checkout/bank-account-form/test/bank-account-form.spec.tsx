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

const createMockIframeElement = (validateResult: boolean) => ({
  validate: jest.fn().mockResolvedValue(validateResult),
  addEventListener: jest.fn(),
});

describe('bank-account-form', () => {
  beforeEach(() => {
    checkoutStore.checkoutLoaded = false;
    checkoutStore.achPaymentsEnabled = false;
  });

  describe('iframe rendering', () => {
    it('renders the iframes', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      const iframes = page.root.querySelectorAll('iframe-input');
      const fields = [
        { inputId: 'accountNumber', label: 'Account Number' },
        { inputId: 'routingNumber', label: 'Routing Number' },
      ];
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
    it('returns true when all iframe fields are valid', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      const instance = page.rootInstance as any;
      instance.accountNumberIframeElement = createMockIframeElement(true);
      instance.routingNumberIframeElement = createMockIframeElement(true);

      const result = await instance.validate();

      expect(result).toBe(true);
    });

    it('returns false when any iframe field is invalid', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      const instance = page.rootInstance as any;
      instance.accountNumberIframeElement = createMockIframeElement(true);
      instance.routingNumberIframeElement = createMockIframeElement(false);

      const result = await instance.validate();

      expect(result).toBe(false);
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

    it('validate returns false', async () => {
      const page = await newSpecPage({
        components: [BankAccountForm],
        html: '<bank-account-form></bank-account-form>',
      });

      await page.waitForChanges();

      const instance = page.rootInstance as any;
      const result = await instance.validate();

      expect(result).toBe(false);
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
