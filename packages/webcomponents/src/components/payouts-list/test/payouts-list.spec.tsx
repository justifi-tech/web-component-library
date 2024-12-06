import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PayoutsList } from "../payouts-list";
import { PayoutsListCore } from "../payouts-list-core";
import { PayoutService } from '../../../api/services/payout.service';
import JustifiAnalytics from "../../../api/Analytics";
jest.mock('../../../api/services/payout.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('payouts-list', () => {
  it('emits an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => <justifi-payouts-list onError-event={errorEvent} />,
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Account ID and Auth Token are required',
          severity: 'error'
        },
      })
    );
  });

  it('emits an error event when fetch fails', async () => {
    PayoutService.prototype.fetchPayouts = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const onErrorSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => (
        <justifi-payouts-list
          account-id="abc"
          auth-token="abc"
          onError-event={onErrorSpy}
        />
      ),
    });

    await page.waitForChanges();

    expect(onErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        },
      })
    );
  });
});
