import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import StateOptions from '../../billing-form/state-options';

@Component({
  tag: 'justifi-business-address-form',
  styleUrl: 'business-address-form.scss',
  shadow: true,
})
export class BusinessAddressForm {
  @State() address: any = {};
  @Prop() defaultValues?: any;
  @Prop() errors?: any = {};
  @Prop() onFormUpdate: (values: any) => void;

  @Watch('address')
  handleAddressChange(newValue: any) {
    this.onFormUpdate(newValue)
  }

  onChange(field) {
    this.address = { ...this.address, ...field };
  };

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gx-2 gy-2">
          <div class="col-12">
            <form-control-text
              name="line1"
              label="Street Address"
              defaultValue={this.defaultValues?.line1}
              error={this.errors?.line1}
              onChange={(event: any) => this.onChange(event)} />
          </div>

          <div class="col-12">
            <form-control-text
              name="line2"
              label="Apt, Suite, etc. (optional)"
              defaultValue={this.defaultValues?.line2}
              error={this.errors?.line2}
              onChange={(event: any) => this.onChange(event)} />
          </div>

          <div class="col-12">
            <form-control-text
              name="city"
              label="City"
              defaultValue={this.defaultValues?.city}
              error={this.errors?.city}
              onChange={(event: any) => this.onChange(event)} />
          </div>

          <div class="col-12">
            <form-control-select
              name="state"
              label="State"
              defaultValue={this.defaultValues?.state}
              options={StateOptions}
              error={this.errors?.state}
              onChange={(event: any) => this.onChange(event)} />
          </div>

          <div class="col-12">
            <form-control-text
              name="postal_code"
              label="Postal Code"
              defaultValue={this.defaultValues?.postal_code}
              error={this.errors?.postal_code}
              onChange={(event: any) => this.onChange(event)} />
          </div>
        </div>
      </Host>
    );
  }

}
