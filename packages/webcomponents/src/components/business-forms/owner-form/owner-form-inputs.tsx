import { Component, h, Prop } from '@stencil/core';
import { IDENTITY_MASKS, PHONE_MASKS } from '../../../utils/form-input-masks';
import { updateAddressFormValues, updateDateOfBirthFormValues, updateFormValues } from '../utils/input-handlers';
import { FormController } from '../../../components';
import { CountryCode } from '../../../utils/country-codes';
import { countryLabels } from '../utils/country-config';

@Component({
  tag: 'owner-form-inputs'
})
export class BusinessOwnerFormInputs {
  @Prop() ownerDefaultValue: any;
  @Prop() errors: any;
  @Prop() formController: FormController;
  @Prop() country: CountryCode;

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
          <form-control-text
            name="title"
            label="Title"
            defaultValue={this.ownerDefaultValue.title}
            errorText={this.errors.title}
            inputHandler={this.inputHandler}
            helpText="Role at your business, e.g. President, CEO, Treasurer."
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
        <div class="col-12 col-md-4">
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
        <div class="col-12 col-md-8">
          <form-control-number-masked
            name="identification_number"
            label={countryLabels[this.country].idNumberLabel}
            defaultValue={this.ownerDefaultValue.identification_number}
            errorText={this.errors.identification_number}
            inputHandler={this.inputHandler}
            mask={IDENTITY_MASKS[this.country]}
            helpText={countryLabels[this.country].identityHelpText}
          />
        </div>
        <div class="col-12">
          <justifi-identity-address-form
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
