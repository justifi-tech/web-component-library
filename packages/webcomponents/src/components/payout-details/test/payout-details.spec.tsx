import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PayoutDetails } from "../payout-details";
import { PayoutDetailsCore } from "../payout-details-core";
import { PayoutService } from "../../../api/services/payout.service";
import JustifiAnalytics from "../../../api/Analytics";
jest.mock("../../../api/services/payout.service");

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('payout-details', () => {
  it('renders error state when no payoutId or authToken', async () => {
    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      template: () => <justifi-payout-details />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits error event when no payoutId', async () => {
    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      template: () => <justifi-payout-details authToken="token" onError-event={eventSpy} />,
    });
    await page.waitForChanges();
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Failed to load payout details. payoutId or authToken is not provided.',
        errorCode: 'missing-props',
        severity: 'error'
      }
    }));
  });

  it('emits error event when no authToken', async () => {
    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      template: () => <justifi-payout-details payoutId="payoutId" onError-event={eventSpy} />,
    });
    await page.waitForChanges();
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Failed to load payout details. payoutId or authToken is not provided.',
        errorCode: 'missing-props',
        severity: 'error'
      }
    }));
  });

  it('emits an error event when fetch fails', async () => {
    PayoutService.prototype.fetchPayout = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch'));

    const onErrorSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      template: () => <justifi-payout-details payoutId="payoutId" authToken="authToken" onError-event={onErrorSpy} />,
    });

    await page.waitForChanges();

    expect(onErrorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Failed to fetch',
        errorCode: 'fetch-error',
        severity: 'error'
      }
    }));
  });
});
