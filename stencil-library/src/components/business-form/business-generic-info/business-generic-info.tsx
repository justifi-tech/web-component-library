import { Component, Host, h, Prop, State } from '@stencil/core';

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
})
export class BusinessGenericInfo {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() business: any = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
    this.formController.values.subscribe(values => (this.business = { ...values }));
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gy-3">
          <div class="col-12 col-md-6">
            <form-control-text name="legal_name" label="Legal Name" defaultValue={this.business.legal_name} error={this.errors.legal_name} inputHandler={this.inputHandler} />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              name="doing_business_as"
              label="Doing Business As (DBA)"
              defaultValue={this.business.doing_business_as}
              error={this.errors.doing_business_as}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              name="business_type"
              label="Business Type"
              options={BusinessTypeOptions}
              defaultValue={this.business.business_type}
              error={this.errors.business_type}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              name="business_structure"
              label="Business Structure"
              options={BusinessStructureOptions}
              defaultValue={this.business.business_structure}
              error={this.errors.business_structure}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text name="industry" label="Industry" defaultValue={this.business.industry} error={this.errors.business_structure} inputHandler={this.inputHandler} />
          </div>
          <div class="col-12">
            <form-control-text name="tax_id" label="Tax ID" defaultValue={this.business.tax_id} error={this.errors.tax_id} inputHandler={this.inputHandler} />
          </div>
          <div class="col-12">
            <form-control-text name="website_url" label="Website URL" defaultValue={this.business.website_url} error={this.errors.website_url} inputHandler={this.inputHandler} />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text name="email" label="Email Address" defaultValue={this.business.email} error={this.errors.email} inputHandler={this.inputHandler} />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text name="phone" label="Phone Number" defaultValue={this.business.phone} error={this.errors.phone} inputHandler={this.inputHandler} />
          </div>
        </div>
      </Host>
    );
  }
}
