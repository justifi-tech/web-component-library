import { Component, h, Prop, State } from '@stencil/core';
import { IDENTITY_MASKS, PHONE_MASKS } from '../../../utils/form-input-masks';
import { updateAddressFormValues, updateDateOfBirthFormValues, updateFormValues } from '../utils/input-handlers';
import { FormController } from '../../../components';
import { CountryCode } from '../../../utils/country-codes';
import { countryLabels } from '../utils/country-config';
import { businessTitleOptions } from '../utils/business-form-options';
import { label, inputDisabled, buttonSecondary } from '../../../styles/parts';

@Component({
  tag: 'owner-form-inputs'
})
export class OwnerFormInputs {
  @Prop() ownerDefaultValue!: any;
  @Prop() errors!: any;
  @Prop() formController!: FormController;
  @Prop() country!: CountryCode;
  @State() isEditingIdentification: boolean = false;

  inputHandler = (name: string, value: string) => {
    updateFormValues(this.formController, { [name]: value });
  }

  onAddressFormUpdate = (values: any): void => {
    updateAddressFormValues(this.formController, {
      ...this.formController.values.getValue().address,
      ...values,
    });
  }

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12 col-md-8">
          <form-control-text
            name="name"
            label="Full Name"
            defaultValue={this.ownerDefaultValue.name}
            errorText={this.errors.name}
            inputHandler={this.inputHandler}
          />
        </div>
        <div class="col-12 col-md-4">
          <form-control-select
            name="title"
            label="Title"
            options={businessTitleOptions}
            defaultValue={this.ownerDefaultValue.title}
            errorText={this.errors.title}
            inputHandler={this.inputHandler}
          />
        </div>
        <div class="col-12 col-md-6">
          <form-control-text
            name="email"
            label="Email Address"
            defaultValue={this.ownerDefaultValue.email}
            errorText={this.errors.email}
            inputHandler={this.inputHandler}
          />
        </div>
        <div class="col-12 col-md-6">
          <form-control-number-masked
            name="phone"
            label="Phone Number"
            defaultValue={this.ownerDefaultValue.phone}
            errorText={this.errors.phone}
            inputHandler={this.inputHandler}
            mask={PHONE_MASKS.US}
          />
        </div>
        <div class="col-12 col-md-3">
          <form-control-date
            name="dob_full"
            label="Birth Date"
            defaultValue={this.ownerDefaultValue.dob_full}
            errorText={this.errors.dob_full}
            inputHandler={this.inputHandler}
            onFormControlInput={(e) => updateDateOfBirthFormValues(e, this.formController)}
            helpText="Must be 18 or older."
          />
        </div>
        <div class="col-12 col-md-3">
          <form-control-number
            name="ownership_percentage"
            label="% of Ownership"
            defaultValue={this.ownerDefaultValue?.ownership_percentage}
            errorText={this.errors.ownership_percentage}
            inputHandler={this.inputHandler}
          />
        </div>
        <div class="col-12 col-md-6">
          {(!this.ownerDefaultValue?.ssn_last4 || this.isEditingIdentification) ? (
            <form-control-number-masked
              name="identification_number"
              label={this.country === CountryCode.CAN ? countryLabels[this.country].idNumberLabelOptional : countryLabels[this.country].idNumberLabel}
              defaultValue={this.isEditingIdentification ? '' : this.ownerDefaultValue.identification_number}
              errorText={this.errors.identification_number}
              inputHandler={this.inputHandler}
              mask={IDENTITY_MASKS[this.country]}
              helpText={countryLabels[this.country].identityHelpText}
            />
          ) : (
            <div>
              <label class="form-label" part={label}>
                {this.country === CountryCode.CAN ? countryLabels[this.country].idNumberLabelOptional : countryLabels[this.country].idNumberLabel}
              </label>
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  part={inputDisabled}
                  value={`****${this.ownerDefaultValue?.ssn_last4}`}
                  disabled />
                <button
                  class="btn btn-secondary"
                  type="button"
                  part={buttonSecondary}
                  onClick={() => {
                    this.isEditingIdentification = true;
                    // Clear last4 and current value to force validation
                    updateFormValues(this.formController, {
                      ssn_last4: null,
                      identification_number: ''
                    });
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>
        <div class="col-12">
          <identity-address-form
            errors={this.errors.address}
            defaultValues={this.ownerDefaultValue.address}
            handleFormUpdate={this.onAddressFormUpdate}
            country={this.country}
          />
        </div>
      </div>
    )
  };
}
