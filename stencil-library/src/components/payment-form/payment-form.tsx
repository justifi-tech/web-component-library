import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'justifi-payment-form',
  shadow: false,
})
export class PaymentForm {
  @Prop() validationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';

  render() {
    return (
      <Host>
        <form>
          <slot />
        </form>
      </Host>
    );
  }
}
