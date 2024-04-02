import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PayoutsList } from "../payouts-list";
import { PayoutsListCore } from "../payouts-list-core";
import { PayoutService } from "../../../api/services/payout.service";

describe('payouts-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => <justifi-payouts-list />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => <justifi-payouts-list auth-token="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => <justifi-payouts-list account-id="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits tokenExpired when the token is expired', async () => {
    const tokenExpired = jest.fn();

    const fetchPayoutsMock = jest.spyOn(PayoutService.prototype, 'fetchPayouts' as keyof PayoutService);

    fetchPayoutsMock.mockResolvedValue({
      "error": {
        "code": "not_authenticated",
        "message": "Not Authenticated"
      }
    });

    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => <justifi-payouts-list account-id="abc" auth-token="abc" onTokenExpired={tokenExpired} />,
    });

    await page.waitForChanges();

    expect(tokenExpired).toHaveBeenCalled();
  });
});
