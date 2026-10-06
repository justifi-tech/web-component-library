/**
 * /dispute example server needs DISPUTE_ID plus CLIENT_ID + CLIENT_SECRET (see .env.example)
 * so Express can mint a web component token. Browser dispute API traffic is mocked with page.route.
 */
import { readFileSync } from 'fs';
import path from 'path';
import type { Request, Route } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { waitForComponent } from './helpers';

const MOCK_DIR = path.join(__dirname, '../../../mockData');

type DisputeApiEnvelope = {
  id: string;
  type: string;
  page_info: null;
  data: Record<string, unknown>;
};

function loadFixture(disputeId: string): DisputeApiEnvelope {
  const raw = JSON.parse(
    readFileSync(path.join(MOCK_DIR, 'mockDisputeResponse.json'), 'utf-8'),
  ) as DisputeApiEnvelope;
  raw.id = disputeId;
  raw.data = { ...raw.data, id: disputeId };
  return raw;
}

function isDisputeRootGet(url: string, disputeId: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname.toLowerCase() === `/v1/disputes/${disputeId}`.toLowerCase();
  } catch {
    return false;
  }
}

function parseRequestJson(route: Route): Record<string, unknown> {
  return parseRequestJsonFromRequest(route.request());
}

function parseRequestJsonFromRequest(req: Request): Record<string, unknown> {
  const asJson = req.postDataJSON();
  if (asJson && typeof asJson === 'object' && !Array.isArray(asJson)) {
    return asJson as Record<string, unknown>;
  }
  const raw = req.postData();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

test.describe('justifi-dispute-management (E2E smoke)', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.skip(
      !process.env.DISPUTE_ID ||
        !process.env.CLIENT_ID ||
        !process.env.CLIENT_SECRET,
      'DISPUTE_ID and CLIENT_ID/CLIENT_SECRET required for /dispute example server',
    );
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/v1/disputes/**');
  });

  test('loads needs_response dispute and shows notification actions', async ({
    page,
  }) => {
    const disputeId = process.env.DISPUTE_ID as string;
    const getBody = loadFixture(disputeId);

    await page.route('**/v1/disputes/**', async (route) => {
      const url = route.request().url();
      if (route.request().method() === 'GET' && isDisputeRootGet(url, disputeId)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(getBody),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/dispute');
    await waitForComponent(page, 'justifi-dispute-management');

    await expect(
      page.getByRole('heading', { name: 'This payment is disputed' }),
    ).toBeVisible();
    await expect(page.getByText(/\$120\.00/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept dispute' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Counter dispute' })).toBeVisible();
  });

  test('Accept dispute sends POST with forfeit true and shows lost state after refetch', async ({
    page,
  }) => {
    const disputeId = process.env.DISPUTE_ID as string;
    let getBody = loadFixture(disputeId);
    let sawForfeitPost = false;

    await page.route('**/v1/disputes/**', async (route) => {
      const url = route.request().url();
      if (route.request().method() === 'GET' && isDisputeRootGet(url, disputeId)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(getBody),
        });
        return;
      }
      if (route.request().method() === 'POST' && url.includes('/response')) {
        const body = parseRequestJson(route) as { forfeit?: boolean };
        sawForfeitPost = true;
        expect(body.forfeit).toBe(true);
        getBody = {
          ...getBody,
          data: {
            ...getBody.data,
            status: 'lost',
          },
        };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: getBody.id,
            type: getBody.type,
            data: getBody.data,
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/dispute');
    await waitForComponent(page, 'justifi-dispute-management');

    await page.getByRole('button', { name: 'Accept dispute' }).click();

    await expect.poll(() => sawForfeitPost).toBe(true);
    await expect(
      page.getByRole('heading', { name: 'This payment was disputed' }),
    ).toBeVisible();
    await expect(
      page.getByText(/settled it in their favor/i),
    ).toBeVisible();
  });

  test('Counter dispute: first step issues PATCH then advances', async ({ page }) => {
    const disputeId = process.env.DISPUTE_ID as string;
    const getBody = loadFixture(disputeId);

    await page.route('**/v1/disputes/**', async (route) => {
      const url = route.request().url();
      if (route.request().method() === 'GET' && isDisputeRootGet(url, disputeId)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(getBody),
        });
        return;
      }
      if (route.request().method() === 'PATCH' && url.includes('/response')) {
        const parsed = parseRequestJson(route);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: getBody.id,
            type: getBody.type,
            data: parsed,
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/dispute');
    await waitForComponent(page, 'justifi-dispute-management');

    await page.getByRole('button', { name: 'Counter dispute' }).click();
    await expect(
      page.getByRole('heading', { name: 'Counter dispute' }),
    ).toBeVisible();

    await page.getByLabel('Product Description').fill('E2E product');
    await page.getByLabel('Service Date').fill('2024-06-15');

    const patchPromise = page.waitForRequest(
      (req) =>
        req.method() === 'PATCH' &&
        req.url().includes(`/v1/disputes/${disputeId}/response`),
    );

    await page.getByRole('button', { name: 'Next' }).click();
    const patchReq = await patchPromise;
    const patchBody = parseRequestJsonFromRequest(patchReq);

    expect(patchBody.product_description).toBe('E2E product');
    expect(String(patchBody.service_date)).toMatch(/^2024-06-15/);

    await expect(
      page.getByRole('heading', { name: 'Customer Details' }),
    ).toBeVisible();
  });
});
