import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import StateOptions from '../../../../utils/state-options';

@Component({
  tag: 'justifi-identity-address-form',
  styleUrl: 'identity-address-form.scss',
  shadow: true,
})
export class IdentityAddressForm {
  @Prop() handleFormUpdate: (values: any) => void;
  @Prop() errors: any;
  @Prop() defaultValues: any;
  @State() address: any = {};

  @Watch('address')
  handleAddressChange(newValues: any) {
    this.handleFormUpdate(newValues);
  }

  inputHandler(name: string, value: string) {
    this.address[name] = value;
    this.address = { ...this.address };
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gy-3">
          <div class="col-12 col-md-8">
            <form-control-text
              name="line1"
              label="Street Address"
              defaultValue={this.defaultValues?.line1}
              error={this.errors?.line1}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-4">
            <form-control-text
              name="line2"
              label="Apartment, Suite, etc. (optional)"
              defaultValue={this.defaultValues?.line2}
              error={this.errors?.line2}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="city"
              label="City"
              defaultValue={this.defaultValues?.city}
              error={this.errors?.city}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              name="state"
              label="State"
              defaultValue={this.defaultValues?.state}
              options={StateOptions}
              error={this.errors?.state}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-number
              name="postal_code"
              label="Postal Code"
              defaultValue={this.defaultValues?.postal_code}
              error={this.errors?.postal_code}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12">
            <form-control-select
              name="country"
              label="Country"
              options={[{ label: 'United States', value: 'USA' }]}
              inputHandler={this.inputHandler}
              defaultValue={this.defaultValues?.country}
              error={this.errors?.country}
              // just for now so we skip handling country specificities
              disabled={true}
            />
          </div>
        </div>
      </Host>
    );
  }
}
