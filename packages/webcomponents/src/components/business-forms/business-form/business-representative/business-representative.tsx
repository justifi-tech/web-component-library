import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../../../components';
import { PHONE_MASKS, IDENTITY_MASKS } from '../../../../utils/form-input-masks';
import { deconstructDate } from '../../utils/helpers';
import { heading2 } from '../../../../styles/parts';
import { CountryCode } from '../../../../utils/country-codes';
import { countryLabels } from '../../utils/country-config';

@Component({
  tag: 'justifi-business-representative'
})
export class BusinessRepresentative {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() representative: any = {};
  @Prop() country: CountryCode;

  get identificationNumberLabel() {
    const label = countryLabels[this.country].idNumberLabel;
    const labelOptional = countryLabels[this.country].idNumberLabelOptional;
    return this.representative?.ssn_last4 ? labelOptional : label;
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors.representative }),
    );
    this.formController.values.subscribe(
      values => (this.representative = { ...values.representative }),
    );
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      representative: {
        ...this.formController.values.getValue().representative,
        [name]: value,
      },
    });
  }

  onAddressFormUpdate = (values: any): void => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      representative: {
        ...this.formController.values.getValue().representative,
        address: {
          ...this.formController.values.getValue().representative.address,
          ...values,
        },
      },
    });
  }

  onDateOfBirthUpdate = (event): void => {
    const dob_values = deconstructDate(event.detail);

    this.formController.setValues({
      ...this.formController.values.getValue(),
      representative: {
        ...this.formController.values.getValue().representative,
        dob_day: dob_values.dob_day,
        dob_month: dob_values.dob_month,
        dob_year: dob_values.dob_year,
      },
    });
  }

  render() {
    const representativeDefaultValue =
      this.formController.getInitialValues().representative;

    return (
      <Host>
        <fieldset>
          <legend part={heading2}>Representative</legend>
          <div class="row gy-3">
            <div class="col-12 col-md-8">
              <form-control-text
                name="name"
                label="Full Name"
                defaultValue={representativeDefaultValue?.name}
                errorText={this.errors.name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-text
                name="title"
                label="Title"
                defaultValue={representativeDefaultValue?.title}
                errorText={this.errors.title}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={representativeDefaultValue?.email}
                errorText={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={representativeDefaultValue?.phone}
                errorText={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-date
                name="dob_full"
                label="Birth Date"
                defaultValue={representativeDefaultValue?.dob_full}
                errorText={this.errors.dob_full}
                inputHandler={this.inputHandler}
                onFormControlInput={this.onDateOfBirthUpdate}
              />
            </div>
            <div class="col-12 col-md-8">
              <form-control-number-masked
                name="identification_number"
                label={this.identificationNumberLabel}
                defaultValue={representativeDefaultValue?.identification_number}
                errorText={this.errors.identification_number}
                inputHandler={this.inputHandler}
                mask={IDENTITY_MASKS[this.country]}
                helpText={countryLabels[this.country].identityHelpText}
              />
            </div>
            <div class="col-12">
              <justifi-identity-address-form
                errors={this.errors.address}
                defaultValues={representativeDefaultValue?.address}
                handleFormUpdate={this.onAddressFormUpdate}
                country={this.country}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
