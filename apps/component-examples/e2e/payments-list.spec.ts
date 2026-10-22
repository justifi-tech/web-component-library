import { test, expect } from '@playwright/test';
import {
  waitForComponent,
  waitForTableRowChange,
  waitForTableRows,
} from './helpers';

const TAG = 'justifi-payments-list';

test.describe('Payments List Component', () => {
  test('should paginate forward with Next button', async ({ page }) => {
    await page.goto('/payments-list');
    await waitForComponent(page, TAG);
    await waitForTableRows(page, TAG);

    const firstRow = page.locator(`${TAG} tbody tr:first-child`);
    const firstRowText = await firstRow.textContent();

    const nextButton = page.getByRole('button', { name: 'Next»' });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    await waitForTableRowChange(page, TAG, firstRowText!);

    const newFirstRowText = await firstRow.textContent();
    expect(newFirstRowText).not.toBe(firstRowText);
  });

  // Known bug: Previous button doesn't return to the correct page (ISSUE-001 from dogfood report)
  test.fixme('should paginate back with Previous button', async ({ page }) => {
    await page.goto('/payments-list');
    await waitForComponent(page, TAG);
    await waitForTableRows(page, TAG);

    const firstRow = page.locator(`${TAG} tbody tr:first-child`);
    const firstPageText = await firstRow.textContent();

    // Go to page 2
    await page.getByRole('button', { name: 'Next»' }).click();
    await waitForTableRowChange(page, TAG, firstPageText!);

    const page2Text = await firstRow.textContent();

    // Go back to page 1
    await page.getByRole('button', { name: '«Previous' }).click();
    await waitForTableRowChange(page, TAG, page2Text!);

    const backText = await firstRow.textContent();
    expect(backText).toBe(firstPageText);
  });

  test.fixme(
    'should not skip pages on rapid Next clicks',
    async ({ page }) => {
      await page.goto('/payments-list');
      await waitForComponent(page, TAG);
      await waitForTableRows(page, TAG);

      const apiRequests: string[] = [];
      page.on('request', (req) => {
        if (
          req.url().includes('/v1/payments') &&
          req.method() === 'GET'
        ) {
          apiRequests.push(req.url());
        }
      });

      const nextButton = page.getByRole('button', { name: 'Next»' });
      await nextButton.click();
      await nextButton.click();

      await page.waitForTimeout(3000);

      // Only one pagination request should have been made
      expect(apiRequests.length).toBe(1);
    },
  );

  test('should not produce page errors during normal usage', async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/payments-list');
    await waitForComponent(page, TAG);
    await waitForTableRows(page, TAG);

    const firstRow = page.locator(`${TAG} tbody tr:first-child`);
    const page1Text = await firstRow.textContent();

    // Navigate forward
    await page.getByRole('button', { name: 'Next»' }).click();
    await waitForTableRowChange(page, TAG, page1Text!);
    const page2Text = await firstRow.textContent();

    // Navigate back
    await page.getByRole('button', { name: '«Previous' }).click();
    await waitForTableRowChange(page, TAG, page2Text!);

    // Nothing observable happens on click; this just gives a throwing handler a
    // window to reach the pageerror listener.
    await firstRow.click();
    await page.waitForTimeout(1000);

    expect(pageErrors).toHaveLength(0);
  });
});
