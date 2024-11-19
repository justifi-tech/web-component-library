import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import StateOptions from '../../../../utils/state-options';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';
import { IAddress } from '../../../../api/Business';

@Component({
  tag: 'justifi-identity-address-form'
})
export class IdentityAddressForm {
  @Prop() handleFormUpdate: (values: any) => void;
  @Prop() errors: any;
  @Prop() defaultValues: any;
  @State() address: IAddress = {};

  @Watch('address')
  handleAddressChange(newValues: any) {
    this.handleFormUpdate(newValues);
  }

  inputHandler = (name: string, value: string) => {
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
              errorText={this.errors?.line1}
              inputHandler={this.inputHandler}
              helpText="​​Enter your address exactly as stated on your driver's license. No PO Boxes."
            />
          </div>
          <div class="col-12 col-md-4">
            <form-control-text
              name="line2"
              label="Apartment, Suite, etc. (optional)"
              defaultValue={this.defaultValues?.line2}
              errorText={this.errors?.line2}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="city"
              label="City"
              defaultValue={this.defaultValues?.city}
              errorText={this.errors?.city}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              name="state"
              label="State"
              defaultValue={this.defaultValues?.state}
              options={StateOptions}
              errorText={this.errors?.state}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              name="postal_code"
              label="Postal Code"
              defaultValue={this.defaultValues?.postal_code}
              errorText={this.errors?.postal_code}
              maxLength={5}
              keyDownHandler={numberOnlyHandler}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-select
              name="country"
              label="Country"
              options={[{ label: 'United States', value: 'USA' }]}
              inputHandler={this.inputHandler}
              defaultValue={this.defaultValues?.country}
              errorText={this.errors?.country}
              // just for now so we skip handling country specificities
              disabled={true}
            />
          </div>
        </div>
      </Host>
    );
  }
}
