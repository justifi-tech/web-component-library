import { newSpecPage } from '@stencil/core/testing';
import { PayoutDetailsCore } from '../payout-details-core';
import mockPayoutDetailSuccess from '../../../api/mockData/mockPayoutDetailsSuccess.json';

describe('payout-details-core', () => {
  let payoutServiceMock;

  beforeEach(() => {
    payoutServiceMock = {
      fetchPayout: jest.fn(),
    };
  });

  it('renders loading state initially', async () => {
    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      html: '<payout-details-core></payout-details-core>',
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders error state when no payoutId or authToken', async () => {
    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      html: '<payout-details-core></payout-details-core>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('fetches payout details on connected callback', async () => {
    payoutServiceMock.fetchPayout.mockResolvedValueOnce(mockPayoutDetailSuccess);
    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      html: '<payout-details-core></payout-details-core>',
      supportsShadowDom: true,
    });

    page.rootInstance.payoutId = '123';
    page.rootInstance.authToken = 'token';
    page.rootInstance.payoutService = payoutServiceMock;
    await page.waitForChanges();

    expect(payoutServiceMock.fetchPayout).toHaveBeenCalledWith('123', 'token');
    expect(page.rootInstance.payout).toEqual(expect.objectContaining({
      "id": "po_17745yESnHyEgWNeunmhmR"
    }));
    expect(page.root).toMatchSnapshot();
  });

  it('handles fetch payout error correctly', async () => {
    payoutServiceMock.fetchPayout.mockRejectedValueOnce('Fetch error');
    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      html: '<payout-details-core></payout-details-core>',
    });

    page.rootInstance.payoutId = '123';
    page.rootInstance.authToken = 'token';
    page.rootInstance.payoutService = payoutServiceMock;
    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Error fetching payout details: Fetch error');
    expect(page.root).toMatchSnapshot();
  });
});

