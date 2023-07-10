import { Component, Host, h, Prop } from '@stencil/core';
import StateOptions from '../../billing-form/state-options';
import FormState from '../../form/form';

@Component({
  tag: 'justifi-business-address-form',
  styleUrl: 'business-address-form.scss',
  shadow: true,
})
export class BusinessAddressForm {
  @Prop() form: FormState;
  @Prop() subFormName: string;

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gx-2 gy-2">
          <div class="col-12">
            <form-control-text
              name={`${this.subFormName}.line1`}
              label="Street Address"
              defaultValue={this.form.defaultValues[this.subFormName]?.address?.line1}
              error={this.form.errors[`${this.subFormName}.line1`]} />
          </div>

          <div class="col-12">
            <form-control-text
              name={`${this.subFormName}.line2`}
              label="Apt, Suite, etc. (optional)"
              defaultValue={this.form.defaultValues[this.subFormName]?.address?.line2}
              error={this.form.errors[`${this.subFormName}.line2`]} />
          </div>

          <div class="col-12">
            <form-control-text
              name={`${this.subFormName}.city`}
              label="City"
              defaultValue={this.form.defaultValues[this.subFormName]?.address?.city}
              error={this.form.errors[`${this.subFormName}.city`]} />
          </div>

          <div class="col-12">
            <form-control-select
              name={`${this.subFormName}.state`}
              label="State"
              defaultValue={this.form.defaultValues[this.subFormName]?.address?.state}
              options={StateOptions}
              error={this.form.errors[`${this.subFormName}.state`]} />
          </div>

          <div class="col-12">
            <form-control-text
              name={`${this.subFormName}.postal_code`}
              label="Postal Code"
              defaultValue={this.form.defaultValues[this.subFormName]?.address?.postal_code}
              error={this.form.errors[`${this.subFormName}.postal_code`]} />
          </div>
        </div>
      </Host>
    );
  }

}
