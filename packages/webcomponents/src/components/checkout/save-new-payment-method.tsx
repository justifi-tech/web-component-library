import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-save-new-payment-method',
  shadow: true
})
export class SaveNewPaymentMethod {
  @State() isChecked: boolean = false;
  @Event({ bubbles: true }) checkboxChanged: EventEmitter<boolean>;

  handleCheckboxChange(_name, value) {
    this.isChecked = value;
    this.checkboxChanged.emit(this.isChecked);
  }

  render() {
    return (
      <StyledHost>
        <div class="mt-4 form-check">
          <form-control-checkbox
            label="Save new payment method"
            name="saveNewPaymentMethod"
            checked={this.isChecked}
            inputHandler={this.handleCheckboxChange.bind(this)}
          />
        </div>
      </StyledHost>
    );
  }
}
