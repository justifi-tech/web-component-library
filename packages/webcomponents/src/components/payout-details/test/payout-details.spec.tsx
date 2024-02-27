import { newSpecPage } from "@stencil/core/testing";
import { PayoutDetails } from "../payout-details";
import { PayoutDetailsCore } from "../payout-details-core";

describe('payout-details', () => {
  it('renders error state when no payoutId or authToken', async () => {
    const page = await newSpecPage({
      components: [PayoutDetails, PayoutDetailsCore],
      html: '<justifi-payout-details></justifi-payout-details>',
    });
    await page.waitForChanges();
    // expect(page.root).toMatchSnapshot();
  });
});
