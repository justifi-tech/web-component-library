import { Component, Host, h, State, Method, Listen } from '@stencil/core';
import { ValidationError } from 'yup';
import StateOptions from '../../billing-form/state-options';
import BusinessAddressFormSchema, { IBusinessAddress } from './business-address-schema';

@Component({
  tag: 'justifi-business-address',
  styleUrl: 'business-address.scss',
  shadow: true,
})
export class BusinessAddress {
  @State() businessAddress: IBusinessAddress = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  };
  @State() businessAddressErrors: any = {};

  @Listen('fieldReceivedInput')
  setFormValue(event) {
    const data = event.detail;
    const businessAddressClone = { ...this.businessAddress };
    if (data.name) {
      businessAddressClone[data.name] = data.value;
      this.businessAddress = businessAddressClone;
    }
  }

  @Method()
  async getForm() {
    const newErrors = {};
    let isValid: boolean = true;

    try {
      await BusinessAddressFormSchema.validate(this.businessAddress, { abortEarly: false });
    } catch (err) {
      isValid = false;
      err.inner.map((item: ValidationError) => {
        newErrors[item.path] = item.message;
      });
    }

    this.businessAddressErrors = newErrors;

    return { isValid: isValid, values: this.businessAddress }
  };

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
