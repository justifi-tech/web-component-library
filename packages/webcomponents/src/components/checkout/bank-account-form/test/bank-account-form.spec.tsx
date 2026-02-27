jest.mock('../../../config-provider/config-state', () => ({
  configState: { iframeOrigin: 'https://test-iframe.justifi.ai' },
  waitForConfig: jest.fn().mockResolvedValue(undefined),
}));

import { newSpecPage } from '@stencil/core/testing';
import { BankAccountForm } from '../bank-account-form';

const createMockIframeElement = (validateResult: boolean) => ({
  validate: jest.fn().mockResolvedValue(validateResult),
  addEventListener: jest.fn(),
});

describe('bank-account-form', () => {
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
});
