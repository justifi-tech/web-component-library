import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { PaymentProvisioningCountryOptions, getRegionOptions, getRegionLabel, getPostalCodeLabel } from '../../../../utils/payment-provisioning-address-options';
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
  @State() selectedCountry: string = 'USA'; // Default to USA

  @Watch('address')
  handleAddressChange(newValues: any) {
    this.handleFormUpdate(newValues);
  }

  @Watch('defaultValues')
  handleDefaultValuesChange(newValues: any) {
    // Update selected country when default values change
    if (newValues?.country) {
      this.selectedCountry = newValues.country;
    }
  }

  inputHandler = (name: string, value: string) => {
    // Handle country change to update region options and clear state if needed
    if (name === 'country') {
      this.selectedCountry = value;
      // Single update that sets country and clears state
      this.address[name] = value;
      this.address.state = '';
      this.address = { ...this.address };
    } else {
      // Regular field update
      this.address[name] = value;
      this.address = { ...this.address };
    }
  }

  render() {
    // Update selected country based on current address values or default
    const currentCountry = this.address?.country || this.defaultValues?.country || this.selectedCountry;
    
    // Get dynamic options and labels based on selected country
    const regionOptions = getRegionOptions(currentCountry);
    const regionLabel = getRegionLabel(currentCountry);
    const postalCodeLabel = getPostalCodeLabel(currentCountry);
    
    // Configure postal code input based on country
    const postalCodeConfig = currentCountry === 'CA' ? {
      maxLength: 7, // A1A 1A1 with space
      keyDownHandler: undefined, // Allow letters for Canadian postal codes
    } : {
      maxLength: 10, // 12345-6789 for US extended zip
      keyDownHandler: numberOnlyHandler,
    };

    return (
      <Host>
        <div class="row gy-3">
          <div class="col-12">
            <form-control-select
              name="country"
              label="Country"
              options={PaymentProvisioningCountryOptions}
              inputHandler={this.inputHandler}
              defaultValue={this.defaultValues?.country || 'USA'}
              errorText={this.errors?.country}
            />
          </div>
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
              label={regionLabel}
              defaultValue={this.defaultValues?.state}
              options={regionOptions}
              errorText={this.errors?.state}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              name="postal_code"
              label={postalCodeLabel}
              defaultValue={this.defaultValues?.postal_code}
              errorText={this.errors?.postal_code}
              maxLength={postalCodeConfig.maxLength}
              keyDownHandler={postalCodeConfig.keyDownHandler}
              inputHandler={this.inputHandler}
              helpText={currentCountry === 'CA' ? 'Format: A1A 1A1' : 'Format: 12345 or 12345-6789'}
            />
          </div>
        </div>
      </Host>
    );
  }
}
