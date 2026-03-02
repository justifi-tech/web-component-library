import { Component, h, State, Event, EventEmitter, Prop, Host } from '@stencil/core';
import { checkoutStore } from '../../../store/checkout.store';

@Component({
  tag: 'save-new-payment-method',
})
export class SaveNewPaymentMethod {
  @Prop() label?: string = 'Save New Payment Method';
  @Prop() hidden?: boolean;
  @State() isChecked: boolean = false;
  @Event({ bubbles: true }) checkboxChanged: EventEmitter<boolean>;

  private handleCheckboxChange = (_name: string, value: boolean) => {
    this.isChecked = value;
    checkoutStore.savePaymentMethod = value;
    this.checkboxChanged.emit(this.isChecked);
  }

  render() {
    return (
      <Host hidden={this.hidden}>
        <form-control-checkbox
          label={this.label || 'Save New Payment Method'}
          name="saveNewPaymentMethod"
          checked={this.isChecked}
          inputHandler={this.handleCheckboxChange}
        />
      </Host>
    );
  }
}
