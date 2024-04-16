import { h } from "@stencil/core";
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

  it('emits an error event when accountId and authToken are not provided', async () => {
    const onErrorSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutsList, PayoutsListCore],
      template: () => <justifi-payouts-list onErrorEvent={onErrorSpy} />,
    });

    await page.waitForChanges();

    expect(onErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Account ID and Auth Token are required',
        },
      })
    );
  });
});
