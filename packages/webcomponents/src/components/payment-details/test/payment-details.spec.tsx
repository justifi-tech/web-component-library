import { newSpecPage } from "@stencil/core/testing";
import { PaymentDetails } from "../payment-details";
import { PaymentDetailsCore } from "../payment-details-core";
import { Details } from "../../details/details";

describe('payment-details', () => {
  const components = [PaymentDetails, PaymentDetailsCore, Details];
  it('renders an error message when paymentId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components,
      html: '<justifi-payment-details></justifi-payment-details>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when paymentId is not provided', async () => {
    const page = await newSpecPage({
      components,
      html: '<justifi-payment-details auth-token="abc"></justifi-payment-details>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components,
      html: '<justifi-payment-details payment-id="abc"></justifi-payment-details>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});

