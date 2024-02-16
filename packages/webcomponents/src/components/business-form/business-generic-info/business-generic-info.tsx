import { Component, Host, h, Prop, State } from '@stencil/core';

import {
  BusinessStructureOptions,
  BusinessTypeOptions,
} from '../business-form-schema';
import { FormController } from '../../form/form';
import { PHONE_MASKS, TAX_ID_MASKS } from '../../../utils/form-input-masks';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../api/BusinessV2';

/**
 *
 * The difference between this component and business-generic-info-details
 * is that this component is meant to be a form and send data
 * and the other one  is meant to be just read only.
 *
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
  @State() genericInfo: ICoreBusinessInfo = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.values.subscribe(
      values => (this.genericInfo = { ...new CoreBusinessInfo(values) }),
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const genericInfoDefaultValue = this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>General Info</legend>
          <hr />
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <form-control-text
                name="legal_name"
                label="Legal Name"
                defaultValue={genericInfoDefaultValue.legal_name}
                error={this.errors.legal_name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={genericInfoDefaultValue.doing_business_as}
                error={this.errors.doing_business_as}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-select
                name="business_type"
                label="Business Type"
                options={BusinessTypeOptions}
                defaultValue={genericInfoDefaultValue.business_type}
                error={this.errors.business_type}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-select
                name="business_structure"
                label="Business Structure"
                options={BusinessStructureOptions}
                defaultValue={genericInfoDefaultValue.business_structure}
                error={this.errors.business_structure}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="industry"
                label="Industry"
                defaultValue={genericInfoDefaultValue.industry}
                error={this.errors.business_structure}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12">
              <form-control-number-masked
                name="tax_id"
                label="Tax ID"
                defaultValue={genericInfoDefaultValue.tax_id}
                error={this.errors.tax_id}
                inputHandler={this.inputHandler}
                mask={TAX_ID_MASKS.US}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Website URL"
                defaultValue={genericInfoDefaultValue.website_url}
                error={this.errors.website_url}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={genericInfoDefaultValue.email}
                error={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={genericInfoDefaultValue.phone}
                error={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
