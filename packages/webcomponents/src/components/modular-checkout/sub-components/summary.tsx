import { Component, h } from "@stencil/core";
import { text } from "../../../styles/parts";
import { formatCurrency } from "../../../utils/utils";
import checkoutStore from "../../../store/checkout.store";
import { StyledHost } from "../../../ui-components";

@Component({
  tag: 'justifi-checkout-summary',
  shadow: true,
})
export class Summary {
  render() {
    return (
      <StyledHost>
        <section>
          <div>
            <div part={text}>{checkoutStore?.paymentDescription}</div>
            <div>
              <span part={text}>Total</span>&nbsp;
              <span part={text}>{formatCurrency(+checkoutStore?.totalAmount)}</span>
            </div>
          </div>
        </section>
      </StyledHost>
    );
  }
}

