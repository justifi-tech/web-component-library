import { newSpecPage } from "@stencil/core/testing";
import { PayoutsList } from "../payouts-list";
import { PayoutsListCore } from "../payouts-list-core";

describe('payouts-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      html: '<justifi-payouts-list></justifi-payouts-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      html: '<justifi-payouts-list auth-token="abc"></justifi-payouts-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      html: '<justifi-payouts-list account-id="abc"></justifi-payouts-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
