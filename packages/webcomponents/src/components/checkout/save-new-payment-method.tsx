import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkoutStore } from '../../store/checkout.store';

@Component({
  tag: 'justifi-save-new-payment-method',
  shadow: true
})
export class SaveNewPaymentMethod {
  @State() isChecked: boolean = false;
  @Event({ bubbles: true }) checkboxChanged: EventEmitter<boolean>;

  private handleCheckboxChange = (_name: string, value: boolean) => {
    this.isChecked = value;
    checkoutStore.savePaymentMethod = value;
    this.checkboxChanged.emit(this.isChecked);
  }

  render() {
    return (
      <StyledHost>
        <form-control-checkbox
          label="Save New Payment Method"
          name="saveNewPaymentMethod"
          checked={this.isChecked}
          inputHandler={this.handleCheckboxChange}
        />
      </StyledHost>
    );
  }
}
