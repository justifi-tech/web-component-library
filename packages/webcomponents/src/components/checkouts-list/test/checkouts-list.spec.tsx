import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutsList } from '../checkouts-list';
import { CheckoutsListCore } from '../checkouts-list-core';
import { CheckoutService } from '../../../api/services/checkout.service';
import { SubAccountService } from '../../../api/services/subaccounts.service';
import JustifiAnalytics from '../../../api/Analytics';
jest.mock('../../../api/services/checkout.service');
jest.mock('../../../api/services/subaccounts.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('checkouts-list', () => {
  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => <justifi-checkouts-list accountId="" authToken="" onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
  });

  it('emit an error event when fetch fails', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="abc"
          authToken="abc"
          onError-event={errorEvent}
        />
      ),
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });
});

describe('checkouts-list with subAccountId', () => {
  it('uses subAccountId when provided instead of accountId for fetching checkouts', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="acc_123"
          authToken="token_123"
          subAccountId="sub_acc_456"
        />
      ),
    });
    await page.waitForChanges();

    // getCheckouts should be initialized with subAccountId
    expect(page.rootInstance.getCheckouts).toBeDefined();
  });

  it('uses accountId when subAccountId is not provided', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="acc_123"
          authToken="token_123"
        />
      ),
    });
    await page.waitForChanges();

    // getCheckouts should be initialized with accountId
    expect(page.rootInstance.getCheckouts).toBeDefined();
  });

  it('prioritizes subAccountId over accountId when both are provided', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="acc_123"
          authToken="token_123"
          subAccountId="sub_acc_456"
        />
      ),
    });
    await page.waitForChanges();

    // Both getCheckouts and getSubAccounts should be initialized
    expect(page.rootInstance.getCheckouts).toBeDefined();
    expect(page.rootInstance.getSubAccounts).toBeDefined();
  });

  it('emits error when only subAccountId is provided without authToken', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId=""
          subAccountId="sub_acc_456"
          authToken=""
          onError-event={errorEvent}
        />
      ),
    });
    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'missing-props',
          message: 'Account ID/Sub Account ID and Auth Token are required',
        })
      })
    );
  });

  it('initializes getSubAccounts with primary accountId, not subAccountId', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    const mockFetchSubAccounts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;
    SubAccountService.prototype.fetchSubAccounts = mockFetchSubAccounts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="acc_123"
          authToken="token_123"
          subAccountId="sub_acc_456"
        />
      ),
    });
    await page.waitForChanges();

    // getSubAccounts should be initialized with the primary accountId
    expect(page.rootInstance.getSubAccounts).toBeDefined();
  });

  it('does not initialize getSubAccounts when accountId is missing', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId=""
          authToken="token_123"
          subAccountId="sub_acc_456"
        />
      ),
    });
    await page.waitForChanges();

    // getSubAccounts should not be initialized without accountId
    expect(page.rootInstance.getSubAccounts).toBeUndefined();
  });

  it('reinitializes data when accountId prop changes', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="acc_123"
          authToken="token_123"
        />
      ),
    });
    await page.waitForChanges();

    const initialGetCheckouts = page.rootInstance.getCheckouts;

    // Change accountId prop
    page.rootInstance.accountId = "acc_456";
    await page.waitForChanges();

    // getCheckouts should be reinitialized
    expect(page.rootInstance.getCheckouts).toBeDefined();
    expect(page.rootInstance.getCheckouts).not.toBe(initialGetCheckouts);
  });

  it('reinitializes data when authToken prop changes', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
          accountId="acc_123"
          authToken="token_123"
        />
      ),
    });
    await page.waitForChanges();

    const initialGetCheckouts = page.rootInstance.getCheckouts;

    // Change authToken prop
    page.rootInstance.authToken = "token_456";
    await page.waitForChanges();

    // getCheckouts should be reinitialized
    expect(page.rootInstance.getCheckouts).toBeDefined();
    expect(page.rootInstance.getCheckouts).not.toBe(initialGetCheckouts);
  });
});
