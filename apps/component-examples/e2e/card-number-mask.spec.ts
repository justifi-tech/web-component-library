import { test, expect } from '@playwright/test';
import {
  waitForComponent,
  waitForCardForm,
  fillIframeInput,
  TEST_DATA,
} from './helpers';

/**
 * The library's half of mask-on-blur: proving `mask-card-number` actually
 * reaches the hosted field across the frame boundary. The masking behaviour
 * itself is covered in iframe-components' own suite, in chromium and webkit.
 *
 * The SDK bakes IFRAME_ORIGIN in at build time, so this passes only against an
 * iframe build that understands `setMaskCardNumber`. Verified locally against
 * a local hosted-field server; unskip once that app is deployed to the origin
 * CI builds with.
 */
const MASK_OVERLAY = '[data-testid="cardNumber-mask"]';
const MASK_TOGGLE = '[data-testid="card-number-reveal-toggle"]';
const MASKED_VISA = '•'.repeat(4) + ' ' + '•'.repeat(4) + ' ' + '•'.repeat(4) + ' 4242';

test.describe('card number masking through the SDK', () => {
  test.fixme(
    'masks on blur when mask-card-number is set',
    async ({ page }) => {
      await page.goto('/tokenize-payment-method?maskNumber=true');
      await waitForComponent(page, 'justifi-tokenize-payment-method');
      await waitForCardForm(page);

      await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
      // Moving to the next field is what blurs the card number.
      await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);

      const card = page.frameLocator('iframe[name="cardNumber"]');
      await expect(card.locator(MASK_OVERLAY)).toHaveValue(MASKED_VISA);
      await expect(card.locator('input[name="cardNumber"]')).toHaveValue(
        TEST_DATA.card.number,
      );

      await card.locator(MASK_TOGGLE).click();
      await expect(card.locator(MASK_OVERLAY)).toHaveCount(0);
    },
  );

  test('leaves the card number visible when the prop is absent', async ({ page }) => {
    await page.goto('/tokenize-payment-method');
    await waitForComponent(page, 'justifi-tokenize-payment-method');
    await waitForCardForm(page);

    await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
    await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);

    const card = page.frameLocator('iframe[name="cardNumber"]');
    await expect(card.locator(MASK_OVERLAY)).toHaveCount(0);
    await expect(card.locator(MASK_TOGGLE)).toHaveCount(0);
    await expect(card.locator('input[name="cardNumber"]')).toHaveValue(
      TEST_DATA.card.number,
    );
  });
});
