import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../form/form';

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
    this.formController.errors.subscribe(errors => (this.errors = { ...errors.representative }));
    this.formController.values.subscribe(values => (this.representative = { ...values.representative }));
  }

  inputHandler(name: string, value: string) {
    this.representative = { ...this.representative, [name]: value };
  }

  onAddressFormUpdate(values: any): void {
    this.representative = { ...this.representative, address: values };
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          <div class="row gy-3">
            <div class="col-12 col-md-8">
              <form-control-text name="name" label="Full Name" defaultValue={this.representative.name} error={this.errors.name} inputHandler={this.inputHandler} />
            </div>

            <div class="col-12 col-md-4">
              <form-control-select
                name="title"
                label="Prefix"
                defaultValue={this.representative.title}
                options={[
                  { label: 'Select Prefix', value: '' },
                  { label: 'Mrs.', value: 'Mrs.' },
                ]}
                error={this.errors.title}
                inputHandler={this.inputHandler}
              />
            </div>

            <div class="col-12 col-md-6">
              <form-control-text name="email" label="Email Address" defaultValue={this.representative.email} error={this.errors.email} inputHandler={this.inputHandler} />
            </div>

            <div class="col-12 col-md-6">
              <form-control-text name="phone" label="Phone Number" defaultValue={this.representative.phone} error={this.errors.phone} inputHandler={this.inputHandler} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">
                Birth Date
              </label>
            </div>

            <div class="col-12 col-md-4">
              <form-control-text name="dob_day" label="Day" defaultValue={this.representative.dob_day} error={this.errors.dob_day} inputHandler={this.inputHandler} />
            </div>

            <div class="col-12 col-md-4">
              <form-control-text name="dob_month" label="Month" defaultValue={this.representative.dob_month} error={this.errors.dob_month} inputHandler={this.inputHandler} />
            </div>

            <div class="col-12 col-md-4">
              <form-control-text name="dob_year" label="Year" defaultValue={this.representative.dob_year} error={this.errors.dob_year} inputHandler={this.inputHandler} />
            </div>

            <div class="col-12">
              <form-control-text
                name="identification_number"
                label="EIN/SSN"
                defaultValue={this.representative.identification_number}
                error={this.errors.identification_number}
                inputHandler={this.inputHandler}
              />
            </div>

            <div class="col-12">
              <justifi-business-address-form errors={this.errors.address} defaultValues={this.representative.address} onFormUpdate={values => this.onAddressFormUpdate(values)} />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
