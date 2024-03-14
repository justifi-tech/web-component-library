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
      html: `<payout-details-core></payout-details-core>`,
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPayout = mockGetPayout

    // Wait for any state changes to complete
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
      html: '<payout-details-core></payout-details-core>',
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPayout = getPayout;

    page.rootInstance.fetchData();

    await page.waitForChanges();

    expect(mockService.fetchPayout).toHaveBeenCalled(); // Verify the mock service method was called
    expect(page.rootInstance.payout).toEqual(expect.objectContaining({
      "id": mockPayoutDetailSuccess.id, // Verify the component state was updated with mock data
    }));
    expect(page.root).toMatchSnapshot(); // Verify the rendered output
  });


  it('handles fetch payout error correctly', async () => {
    // Mock the service method that gets called by getPayout
    const mockService = {
      fetchPayout: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    // Real getPayout function but with mocked service
    const realGetPayoutWithMockedService = makeGetPayoutDetails({
      id: 'some-id', // Use appropriate id
      authToken: 'some-auth-token', // Use appropriate auth token
      service: mockService // Injecting the mocked service
    });

    const page = await newSpecPage({
      components: [PayoutDetailsCore],
      html: '<payout-details-core></payout-details-core>',
    });

    page.rootInstance.componentWillLoad = () => { };

    // Inject the getPayout function with mocked service into the component
    page.rootInstance.getPayout = realGetPayoutWithMockedService;

    // Manually call fetchData if necessary, depending on how your component is set up
    await page.rootInstance.fetchData();
    await page.waitForChanges();

    // Assertions to verify the error handling
    expect(page.rootInstance.errorMessage).toBe('Error fetching payout details: Error: Fetch error');
    expect(page.root).toMatchSnapshot();
  });
});
