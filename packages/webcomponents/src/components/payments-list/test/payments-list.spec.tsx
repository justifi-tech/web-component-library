import { newSpecPage } from "@stencil/core/testing";
import { PaymentsList } from "../payments-list";
import { PaymentsListCore } from "../payments-list-core";

describe('payments-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      html: '<justifi-payments-list></justifi-payments-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      html: '<justifi-payments-list auth-token="abc"></justifi-payments-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      html: '<justifi-payments-list account-id="abc"></justifi-payments-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
