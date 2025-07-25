import { Component, Host, Prop, State, h } from '@stencil/core';
import { FormController } from '../../../../components';
import { IAddress } from '../../../../api/Business';
import { PaymentProvisioningCountryOptions, getRegionOptions, getRegionLabel, getPostalCodeLabel } from '../../../../utils/address-form-helpers';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';
import { heading2 } from '../../../../styles/parts';

@Component({
  tag: 'justifi-legal-address-form'
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress;

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    this.formController.values.subscribe(
      values => (this.legal_address = { ...values.legal_address })
    );
  }

  inputHandler(name: string, value: string) {
    if (name === 'country') {
       // Clear `state` and `postal_code` fields when country changes
      this.formController.setValues({
        ...this.formController.values.getValue(),
        legal_address: {
          ...this.formController.values.getValue().legal_address,
          [name]: value,
          state: '',
          postal_code: '',
        },
      });
    } else {
      // Regular field update
      this.formController.setValues({
        ...this.formController.values.getValue(),
        legal_address: {
          ...this.formController.values.getValue().legal_address,
          [name]: value,
        },
      });
    }
  }

  render() {
    const legalAddressDefaultValue =
      this.formController.getInitialValues().legal_address;
    
    // Get current country from form values, defaulting to USA
    const currentCountry = this.formController.values.getValue()?.legal_address?.country || 'USA';
    
    // Get dynamic options and labels based on current country
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
        <fieldset>
          <legend part={heading2}>Business Legal Address</legend>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={PaymentProvisioningCountryOptions}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.country}
                errorText={this.errors?.legal_address?.country}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line1}
                errorText={this.errors?.legal_address?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2 (optional)"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line2}
                errorText={this.errors?.legal_address?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.city}
                errorText={this.errors?.legal_address?.city}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="state"
                label={regionLabel}
                options={regionOptions}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.state}
                errorText={this.errors?.legal_address?.state}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="postal_code"
                label={postalCodeLabel}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.postal_code}
                errorText={this.errors?.legal_address?.postal_code}
                maxLength={postalCodeConfig.maxLength}
                keyDownHandler={postalCodeConfig.keyDownHandler}
                helpText={currentCountry === 'CA' ? 'Format: A1A 1A1' : 'Format: 12345 or 12345-6789'}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
