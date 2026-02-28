jest.mock('../../../config-provider/config-state', () => ({
  configState: { iframeOrigin: 'https://test-iframe.justifi.ai' },
  waitForConfig: jest.fn().mockResolvedValue(undefined),
}));

import { newSpecPage } from '@stencil/core/testing';
import { CardForm } from '../card-form';

const createMockIframeElement = (validateResult: boolean) => ({
  validate: jest.fn().mockResolvedValue(validateResult),
  addEventListener: jest.fn(),
});

describe('card-form', () => {
  describe('validate', () => {
    it('returns true when all iframe fields are valid', async () => {
      const page = await newSpecPage({
        components: [CardForm],
        html: '<card-form></card-form>',
      });

      const instance = page.rootInstance as any;
      instance.cardNumberIframeElement = createMockIframeElement(true);
      instance.expirationMonthIframeElement = createMockIframeElement(true);
      instance.expirationYearIframeElement = createMockIframeElement(true);
      instance.cvvIframeElement = createMockIframeElement(true);

      const result = await instance.validate();

      expect(result).toBe(true);
    });

    it('returns false when any iframe field is invalid', async () => {
      const page = await newSpecPage({
        components: [CardForm],
        html: '<card-form></card-form>',
      });

      const instance = page.rootInstance as any;
      instance.cardNumberIframeElement = createMockIframeElement(true);
      instance.expirationMonthIframeElement = createMockIframeElement(false);
      instance.expirationYearIframeElement = createMockIframeElement(true);
      instance.cvvIframeElement = createMockIframeElement(true);

      const result = await instance.validate();

      expect(result).toBe(false);
    });
  });
});
