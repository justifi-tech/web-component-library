import { Component, h, Prop, State } from '@stencil/core';
import { FormController } from '../../../../ui-components/form/form';
import { updateAddressFormValues, updateDateOfBirthFormValues, updateFormValues } from '../../utils/input-handlers';
import { PHONE_MASKS, IDENTITY_MASKS } from '../../../../utils/form-input-masks';
import { heading2, label, inputDisabled, buttonSecondary } from '../../../../styles/parts';
import { CountryCode } from '../../../../utils/country-codes';
import { countryLabels } from '../../utils/country-config';

@Component({
  tag: 'justifi-business-representative-form-inputs',
})
export class RepresentativeFormInputs {
  @Prop() representativeDefaultValue: any;
  @Prop() errors: any;
  @Prop() formController: FormController;
  @Prop() country: CountryCode;
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
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Representative</legend>
            <form-control-tooltip helpText="The representative for your business needs to be someone who has significant control over managing your business’s finance. You will have an opportunity to add owners later in the form." />
          </div>
          <hr class="mt-2" />
          <div class="row gy-3">
            <div class="col-12 col-md-8">
              <form-control-text
                name="name"
                label="Full Name"
                defaultValue={this.representativeDefaultValue?.name}
                errorText={this.errors.name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-text
                name="title"
                label="Title"
                defaultValue={this.representativeDefaultValue?.title}
                errorText={this.errors.title}
                inputHandler={this.inputHandler}
                helpText="Role at your business, e.g. President, CEO, Treasurer."
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={this.representativeDefaultValue?.email}
                errorText={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={this.representativeDefaultValue?.phone}
                errorText={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-date
                name="dob_full"
                label="Birth Date"
                defaultValue={this.representativeDefaultValue?.dob_full}
                errorText={this.errors.dob_full}
                inputHandler={this.inputHandler}
                onFormControlInput={(e) => updateDateOfBirthFormValues(e, this.formController)}
                helpText="Must be 18 or older."
              />
            </div>
            <div class="col-12 col-md-8">
              {(!this.representativeDefaultValue?.ssn_last4 || this.isEditingIdentification) ? (
                <form-control-number-masked
                  name="identification_number"
                  label={countryLabels[this.country].idNumberLabel}
                  defaultValue={this.isEditingIdentification ? '' : this.representativeDefaultValue?.identification_number}
                  errorText={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                  mask={IDENTITY_MASKS[this.country]}
                  helpText={countryLabels[this.country].identityHelpText}
                />
              ) : (
                <div>
                  <label class="form-label" part={label}>
                    {countryLabels[this.country].idNumberLabel}
                  </label>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      class="form-control"
                      part={inputDisabled}
                      value={`****${this.representativeDefaultValue?.ssn_last4}`}
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
              <justifi-identity-address-form
                errors={this.errors.address}
                defaultValues={this.representativeDefaultValue?.address}
                handleFormUpdate={this.onAddressFormUpdate}
                country={this.country}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
};
