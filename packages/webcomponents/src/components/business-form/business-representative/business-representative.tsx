import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../form/form';
import { PHONE_MASKS } from '../../../utils/form-input-masks';

@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
})
export class BusinessRepresentative {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() representative: any = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
    this.onAddressFormUpdate = this.onAddressFormUpdate.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors.representative }),
    );
    this.formController.values.subscribe(
      values => (this.representative = { ...values.representative }),
    );
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      representative: {
        ...this.formController.values.getValue().representative,
        [name]: value,
      },
    });
  }

  onAddressFormUpdate(values: any): void {
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

  render() {
    const representativeDefaultValue =
      this.formController.getInitialValues().representative;

    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          <hr />
          <div class="row gy-3">
            <div class="col-12 col-md-8">
              <form-control-text
                name="name"
                label="Full Name"
                defaultValue={representativeDefaultValue?.name}
                error={this.errors.name}
                inputHandler={this.inputHandler}
              />
            </div>

            <div class="col-12 col-md-4">
              <form-control-select
                name="title"
                label="Prefix"
                defaultValue={representativeDefaultValue?.title}
                options={[
                  { label: 'Select Prefix', value: '' },
                  { label: 'Mrs.', value: 'Mrs.' },
                ]}
                error={this.errors.title}
                inputHandler={this.inputHandler}
              />
            </div>

            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={representativeDefaultValue?.email}
                error={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>

            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={representativeDefaultValue?.phone}
                error={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">
                Birth Date
              </label>
            </div>

            <div class="col-12 col-md-4">
              <form-control-datepart
                name="dob_day"
                label="Day"
                defaultValue={representativeDefaultValue?.dob_day}
                error={this.errors.dob_day}
                inputHandler={this.inputHandler}
                type="day"
              />
            </div>

            <div class="col-12 col-md-4">
              <form-control-datepart
                name="dob_month"
                label="Month"
                defaultValue={representativeDefaultValue?.dob_month}
                error={this.errors.dob_month}
                inputHandler={this.inputHandler}
                type="month"
              />
            </div>

            <div class="col-12 col-md-4">
              <form-control-datepart
                name="dob_year"
                label="Year"
                defaultValue={representativeDefaultValue?.dob_year}
                error={this.errors.dob_year}
                inputHandler={this.inputHandler}
                type="year"
              />
            </div>

            <div class="col-12">
              <form-control-number
                name="identification_number"
                label="SSN"
                defaultValue={representativeDefaultValue?.identification_number}
                error={this.errors.identification_number}
                inputHandler={this.inputHandler}
              />
            </div>

            <div class="col-12">
              <justifi-business-address-form
                errors={this.errors.address}
                defaultValues={representativeDefaultValue?.address}
                onFormUpdate={values => this.onAddressFormUpdate(values)}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
