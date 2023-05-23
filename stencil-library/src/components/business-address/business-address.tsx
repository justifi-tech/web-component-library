import { Component, Host, h, State } from '@stencil/core';
import StateOptions from '../billing-form/state-options';

@Component({
  tag: 'justifi-business-address',
  styleUrl: 'business-address.scss',
  shadow: true,
})
export class BusinessAddress {
  @State() businessAddress = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  };
  @State() businessAddressErrors: any = {};

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gx-2 gy-2">
          <div class="col-12">
            <text-input
              name="line1"
              label="Street Address"
              defaultValue={this.businessAddress?.line1}
              error={this.businessAddressErrors?.line1} />
          </div>

          <div class="col-12">
            <text-input
              name="line2"
              label="Apartment, Suite, etc. (optional)"
              defaultValue={this.businessAddress?.line2}
              error={this.businessAddressErrors?.line2} />
          </div>

          <div class="col-12">
            <text-input
              name="city"
              label="City"
              defaultValue={this.businessAddress?.city}
              error={this.businessAddressErrors?.city} />
          </div>

          <div class="col-12">
            <select-input
              name="state"
              label="State"
              options={StateOptions}
              defaultValue={this.businessAddress.state}
              error={this.businessAddressErrors.state} />
          </div>

          <div class="col-12">
            <text-input
              name="postal_code"
              label="Postal Code"
              defaultValue={this.businessAddress?.postal_code}
              error={this.businessAddressErrors?.postal_code} />
          </div>
        </div>
      </Host>
    );
  }

}
