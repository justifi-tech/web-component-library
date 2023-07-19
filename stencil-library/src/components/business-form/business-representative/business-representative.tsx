import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { FormController } from '../../form/form';

@Component({
  tag: 'justifi-business-representative',
  styleUrl: 'business-representative.scss',
  shadow: true,
})
export class BusinessRepresentative {
  @Prop() formController: FormController
  @State() errors: any = {};
  @State() defaultValues: any = {};
  @State() representative: any = {};

  @Watch('representative')
  handleRepresentativeChange(newValue: any) {
    this.formController.setValues({ representative: newValue });
  }

  componentDidLoad() {
    this.formController.errors.subscribe((errors) => this.errors = { ...errors.representative });
    this.formController.defaultValues.subscribe((defaultValues) => this.defaultValues = { ...defaultValues.representative });
  }

  inputHandler(name: string, value: string) {
    this.representative = { ...this.representative, [name]: value };
  };

  onAddressFormUpdate(values: any): void {
    this.representative = { ...this.representative, address: values };
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Representative</legend>
          <div class="row gx-2 gy-2">
            <div class="col-8">
              <form-control-text
                name="name"
                label="Full Name"
                defaultValue={this.defaultValues.name}
                error={this.errors.name}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-4">
              <form-control-select
                name="title"
                label="Prefix"
                defaultValue={this.defaultValues.title}
                options={[{ label: 'Select Prefix', value: '' }, { label: 'Mrs.', value: 'Mrs.' }]}
                error={this.errors.title}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={this.defaultValues.email}
                error={this.errors.email}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="phone"
                label="Phone Number"
                defaultValue={this.defaultValues.phone}
                error={this.errors.phone}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-12">
              <label part="label" class="form-label">Birth Date</label>
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_day"
                label="Day"
                defaultValue={this.defaultValues.dob_day}
                error={this.errors.dob_day}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_month"
                label="Month"
                defaultValue={this.defaultValues.dob_month}
                error={this.errors.dob_month}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-4">
              <form-control-text
                name="dob_year"
                label="Year"
                defaultValue={this.defaultValues.dob_year}
                error={this.errors.dob_year}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-12">
              <form-control-text
                name="identification_number"
                label="EIN/SSN"
                defaultValue={this.defaultValues.identification_number}
                error={this.errors.identification_number}
                inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>

            <div class="col-12">
              <justifi-business-address-form
                errors={this.errors.address}
                defaultValues={this.defaultValues.address}
                onFormUpdate={(values) => this.onAddressFormUpdate(values)} />
            </div>
          </div>
        </fieldset>
      </Host >
    );
  }

}
