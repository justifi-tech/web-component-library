import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { PayoutDetails } from "../payout-details";
import { PayoutDetailsCore } from "../payout-details-core";
import { PayoutService } from '../../../api/services/payout.service';

describe('payout-details', () => {
  it('renders error state when no payoutId or authToken', async () => {
    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      template: () => <justifi-payout-details />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits tokenExpired when passed an expired token', async () => {
    const fetchPayoutMock = jest.spyOn(PayoutService.prototype, 'fetchPayout');

    fetchPayoutMock.mockResolvedValue({
      "error": {
        "code": "not_authenticated",
        "message": "Not Authenticated"
      }
    });

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      template: () => <justifi-payout-details authToken='123' payoutId='123' onTokenExpired={eventSpy} />
    })

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });
});
