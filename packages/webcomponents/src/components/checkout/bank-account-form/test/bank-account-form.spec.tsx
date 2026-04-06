jest.mock('../../../config-provider/config-state', () => ({
  configState: { iframeOrigin: 'https://test-iframe.justifi.ai' },
  waitForConfig: jest.fn().mockResolvedValue(undefined),
}));

import { newSpecPage } from '@stencil/core/testing';
import { BankAccountForm } from '../bank-account-form';
import { checkoutStore } from '../../../../store/checkout.store';

const createMockIframeElement = (validateResult: boolean) => ({
  validate: jest.fn().mockResolvedValue(validateResult),
  addEventListener: jest.fn(),
});

describe('bank-account-form', () => {
  beforeEach(() => {
    checkoutStore.checkoutLoaded = false;
    checkoutStore.achPaymentsEnabled = false;
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
