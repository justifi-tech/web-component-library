import { Component, Host, h, Prop, State, Watch } from '@stencil/core';

import { BusinessStructureOptions, BusinessTypeOptions } from '../business-form-schema';
import { FormController } from '../../form/form';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-generic-info',
  styleUrl: 'business-generic-info.scss',
  shadow: true,
})
export class BusinessGenericInfo {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() defaultValues: any = {};
  @State() business: any = {};

  @Watch('business')
  handleRepresentativeChange(newValues: any) {
    this.formController.setValues(newValues);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => (this.errors = { ...errors }));
    this.formController.defaultValues.subscribe(defaultValues => (this.defaultValues = { ...defaultValues }));
  }

  inputHandler(name: string, value: string) {
    this.business = { ...this.business, [name]: value };
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gy-3">
          <div class="col-12 col-md-6">
            <form-control-text
              name="legal_name"
              label="Legal Name"
              defaultValue={this.defaultValues.legal_name}
              error={this.errors.legal_name}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              name="doing_business_as"
              label="Doing Business As (DBA)"
              defaultValue={this.defaultValues.doing_business_as}
              error={this.errors.doing_business_as}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              name="business_type"
              label="Business Type"
              options={BusinessTypeOptions}
              defaultValue={this.defaultValues.business_type}
              error={this.errors.business_type}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              name="business_structure"
              label="Business Structure"
              options={BusinessStructureOptions}
              defaultValue={this.defaultValues.business_structure}
              error={this.errors.business_structure}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="industry"
              label="Industry"
              defaultValue={this.defaultValues.industry}
              error={this.errors.business_structure}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="website_url"
              label="Website URL"
              defaultValue={this.defaultValues.website_url}
              error={this.errors.website_url}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              name="email"
              label="Email Address"
              defaultValue={this.defaultValues.email}
              error={this.errors.email}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              name="phone"
              label="Phone Number"
              defaultValue={this.defaultValues.phone}
              error={this.errors.phone}
              inputHandler={(name, value) => this.inputHandler(name, value)}
            />
          </div>
        </div>
      </Host>
    );
  }
}
