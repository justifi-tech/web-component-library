import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PayoutDetailsCore } from '../payout-details-core';
import mockPayoutDetailSuccess from '../../../api/mockData/mockPayoutDetailsSuccess.json';
import { makeGetPayoutDetails } from '../get-payout-details';

describe('payout-details-core', () => {
  it('renders loading state initially', async () => {
    // Define a mock getPayout function as part of the component initialization
    const mockGetPayout = jest.fn().mockImplementation(({ onSuccess }) => {
      // Simulate an asynchronous operation without resolving immediately
      setTimeout(() => onSuccess({ /* mock data */ }), 1000);
    });

    // Initialize the page with the mock getPayout function included in the component tag
    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      template: () => <payout-details-core getPayout={mockGetPayout} />,
    });

    await page.waitForChanges();

    // Assert the loading state is visible in the snapshot
    expect(page.root).toMatchSnapshot();
  });

  it('fetches payout details on connected callback', async () => {
    const mockService = {
      fetchPayout: jest.fn().mockResolvedValue(mockPayoutDetailSuccess),
    };

    const getPayout = makeGetPayoutDetails({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService,
    });

    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      template: () => <payout-details-core getPayout={getPayout} />,
    });

    await page.waitForChanges();

    expect(mockService.fetchPayout).toHaveBeenCalled(); // Verify the mock service method was called
    expect(page.rootInstance.payout).toEqual(expect.objectContaining({
      "id": mockPayoutDetailSuccess.id, // Verify the component state was updated with mock data
    }));
    expect(page.root).toMatchSnapshot(); // Verify the rendered output
  });

  it('handles fetch payout error correctly', async () => {
    const mockService = {
      fetchPayout: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPayout = makeGetPayoutDetails({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      template: () => <payout-details-core getPayout={getPayout} />,
    });

    await page.waitForChanges();

    // Assertions to verify the error handling
    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits errorEvent when fetch payout fails', async () => {
    const mockService = {
      fetchPayout: jest.fn().mockResolvedValue({
        "error": {
          "code": "not_authenticated",
          "message": "Not Authenticated"
        }
      })
    };

    const getPayout = makeGetPayoutDetails({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      template: () => <payout-details-core getPayout={getPayout} onErrorEvent={eventSpy} />,
    });

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "detail": "Not Authenticated"
      })
    );
  });
});
