import { test, expect } from '@playwright/test';
import { waitForComponent } from './helpers';

test.describe('Payments List Component', () => {
  test('should render table with payment data', async ({ page }) => {
    await page.goto('/payments-list');
    await waitForComponent(page, 'justifi-payments-list');

    const headers = page.locator('justifi-payments-list th');
    await expect(headers.first()).toBeVisible();

    const expectedHeaders = [
      'Date',
      'Amount',
      'Status',
      'Type',
      'Description',
      'Account Holder',
      'Payment Method',
      'Card Brand',
    ];

    for (const header of expectedHeaders) {
      await expect(headers.filter({ hasText: header })).toHaveCount(1);
    }

    const rows = page.locator('justifi-payments-list tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('should paginate forward with Next button', async ({ page }) => {
    await page.goto('/payments-list');
    await waitForComponent(page, 'justifi-payments-list');

    const firstRow = page.locator('justifi-payments-list tbody tr:first-child');
    const firstRowText = await firstRow.textContent();

    const nextButton = page.getByRole('button', { name: 'Next»' });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Wait for table content to change
    await expect(firstRow).not.toHaveText(firstRowText!, { timeout: 15000 });

    const newFirstRowText = await firstRow.textContent();
    expect(newFirstRowText).not.toBe(firstRowText);
  });

  // Known bug: Previous button doesn't return to the correct page (ISSUE-001 from dogfood report)
  test.fixme('should paginate back with Previous button', async ({ page }) => {
    await page.goto('/payments-list');
    await waitForComponent(page, 'justifi-payments-list');

    const firstRow = page.locator('justifi-payments-list tbody tr:first-child');
    const firstPageText = await firstRow.textContent();

    // Go to page 2
    await page.getByRole('button', { name: 'Next»' }).click();
    await expect(firstRow).not.toHaveText(firstPageText!, { timeout: 15000 });

    const page2Text = await firstRow.textContent();

    // Go back to page 1
    await page.getByRole('button', { name: '«Previous' }).click();
    await expect(firstRow).not.toHaveText(page2Text!, { timeout: 15000 });

    const backText = await firstRow.textContent();
    expect(backText).toBe(firstPageText);
  });

  test('should emit click-event when a row is clicked', async ({ page }) => {
    await page.goto('/payments-list');
    await waitForComponent(page, 'justifi-payments-list');

    const clickEventPromise = new Promise<string>((resolve) => {
      page.on('console', (msg) => {
        if (msg.type() === 'log' && msg.text().includes('CustomEvent')) {
          resolve(msg.text());
        }
      });
    });

    await page.locator('justifi-payments-list tbody tr:first-child').click();

    const event = await clickEventPromise;
    expect(event).toContain('CustomEvent');
  });

  test.fixme(
    'Previous button should be disabled on the first page',
    async ({ page }) => {
      await page.goto('/payments-list');
      await waitForComponent(page, 'justifi-payments-list');

      const prevButton = page.getByRole('button', { name: '«Previous' });
      await expect(prevButton).toBeDisabled();
    },
  );

  test.fixme(
    'should not skip pages on rapid Next clicks',
    async ({ page }) => {
      await page.goto('/payments-list');
      await waitForComponent(page, 'justifi-payments-list');

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
    await waitForComponent(page, 'justifi-payments-list');

    // Navigate forward
    await page.getByRole('button', { name: 'Next»' }).click();
    await page.waitForTimeout(2000);

    // Navigate back
    await page.getByRole('button', { name: '«Previous' }).click();
    await page.waitForTimeout(2000);

    // Click a row
    await page.locator('justifi-payments-list tbody tr:first-child').click();
    await page.waitForTimeout(1000);

    expect(pageErrors).toHaveLength(0);
  });
});
