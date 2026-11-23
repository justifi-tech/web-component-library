import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-save-new-payment-method',
  shadow: true
})
export class JustifiSaveNewPaymentMethod {
  @Prop() label?: string = 'Save New Payment Method';
  @Prop() hidden?: boolean;

  @Event({ eventName: 'checkbox-changed', bubbles: false, composed: false })
  checkboxChanged: EventEmitter<boolean>;

  render() {
    return (
      <StyledHost>
        <save-new-payment-method
          label={this.label}
          hidden={this.hidden}
          onCheckbox-changed={(e: CustomEvent<boolean>) => this.checkboxChanged.emit(e.detail)}
        />
      </StyledHost>
    );
  }
}
