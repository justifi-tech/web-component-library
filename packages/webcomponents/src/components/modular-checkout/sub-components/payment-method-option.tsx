import { Component, h, Prop } from "@stencil/core";
import { radioListItem } from "../../styles/parts";
import { StyledHost } from "../../ui-components";

@Component({
  tag: 'payment-method-option',
  shadow: true,
})
export class PaymentMethodOption {
  @Prop() paymentMethodOptionId: string;
  @Prop() isSelected: boolean;
  @Prop() clickHandler: (event: MouseEvent) => void;
  @Prop() radioButtonHidden: boolean;
  @Prop() label: string;

  render() {
    return (
      <StyledHost class="payment-method">
        <div
          class="radio-list-item p-3"
          part={radioListItem}
          onClick={this.clickHandler}
          hidden={this.radioButtonHidden}
        >
          <form-control-radio
            name="paymentMethodType"
            value={this.paymentMethodOptionId}
            checked={this.isSelected}
            label={this.label}
          />
        </div>
      </StyledHost>
    );
  }
}
