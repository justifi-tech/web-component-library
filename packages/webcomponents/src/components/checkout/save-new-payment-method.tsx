import { Component, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'justifi-save-new-payment-method',
})
export class SaveNewPaymentMethod {
  @State() isChecked: boolean = false;
  @Event({ bubbles: true }) checkboxChanged: EventEmitter<boolean>;

  handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;
    this.checkboxChanged.emit(this.isChecked);
  }

  render() {
    return (
      <div class="mt-3 d-flex align-items-center">
        <input
          type="checkbox"
          checked={this.isChecked}
          onChange={(event) => this.handleCheckboxChange(event)}
          class="me-2"
        />
        <label class='checkbox-label'>
          Save new payment method
        </label>
      </div>
    );
  }
}
