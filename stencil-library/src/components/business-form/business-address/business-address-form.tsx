import { Component, Host, h, Prop } from '@stencil/core';
import StateOptions from '../../billing-form/state-options';
import FormController from '../../form/form-controller';

@Component({
  tag: 'justifi-business-address-form',
  styleUrl: 'business-address-form.scss',
  shadow: true,
})
export class BusinessAddressForm {
  @Prop() form: FormController;
  @Prop() subFormName: string;
  @Prop() errors: any;

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gx-2 gy-2">
          <div class="col-12">
            <form-control-text
              name="line1"
              label="Street Address"
              {...this.form.register(`${this.subFormName}.line1`)}
              error={this.errors && this.errors[`${this.subFormName}.line1`]} />
          </div>

          <div class="col-12">
            <form-control-text
              name="line2"
              label="Apartment, Suite, etc. (optional)"
              {...this.form.register(`${this.subFormName}.line2`)}
              error={this.errors && this.errors[`${this.subFormName}.line2`]} />
          </div>

          <div class="col-12">
            <form-control-text
              name="city"
              label="City"
              {...this.form.register(`${this.subFormName}.city`)}
              error={this.errors && this.errors[`${this.subFormName}.city`]} />
          </div>

          <div class="col-12">
            <select-input
              name="state"
              label="State"
              options={StateOptions}
              {...this.form.register(`${this.subFormName}.state`)}
              error={this.errors && this.errors[`${this.subFormName}.state`]} />
          </div>

          <div class="col-12">
            <form-control-text
              name="postal_code"
              label="Postal Code"
              {...this.form.register(`${this.subFormName}.postal_code`)}
              error={this.errors && this.errors[`${this.subFormName}.postal_code`]} />
          </div>
        </div>
      </Host>
    );
  }

}
