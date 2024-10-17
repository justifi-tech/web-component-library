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
      <div class="mt-4 form-check">
        <input
          type="checkbox"
          checked={this.isChecked}
          onChange={(event) => this.handleCheckboxChange(event)}
          class="form-check-input"
          part={`form-check-input ${this.isChecked ? 'form-check-input-checked' : ''}`}
        />
        <label class="form-check-label">
          Save new payment method
        </label>
      </div>
    );
  }
}
