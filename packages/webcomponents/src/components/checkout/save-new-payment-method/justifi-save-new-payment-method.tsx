import { Component, h, Prop } from '@stencil/core';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-save-new-payment-method',
  shadow: true
})
export class JustifiSaveNewPaymentMethod {
  @Prop() label?: string = 'Save New Payment Method';
  @Prop() hidden?: boolean;

  @Prop() changeHandler?: (checked: boolean) => void;

  render() {
    return (
      <StyledHost>
        <save-new-payment-method
          label={this.label}
          hidden={this.hidden}
          changeHandler={(checked) => this.changeHandler?.(checked)}
        />
      </StyledHost>
    );
  }
}
