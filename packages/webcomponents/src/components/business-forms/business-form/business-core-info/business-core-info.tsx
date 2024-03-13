import { Component, Host, h, Prop, State } from '@stencil/core';

import {
  BusinessStructureOptions,
  BusinessTypeOptions,
} from '../business-form-schema';
import { FormController } from '../../../form/form';
import { PHONE_MASKS, TAX_ID_MASKS } from '../../../../utils/form-input-masks';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../../api/Business';

/**
 *
 * The difference between this component and business-core-info-details
 * is that this component is meant to be a form and send data
 * and the other one  is meant to be just read only.
 *
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-core-info',
  styleUrl: 'business-core-info.scss',
})
export class BusinessCoreInfo {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() coreInfo: ICoreBusinessInfo = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.values.subscribe(
      values => (this.coreInfo = { ...new CoreBusinessInfo(values) }),
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
    const coreInfoDefaultValue = this.formController.getInitialValues();

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
                defaultValue={coreInfoDefaultValue.legal_name}
                error={this.errors.legal_name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={coreInfoDefaultValue.doing_business_as}
                error={this.errors.doing_business_as}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-select
                name="business_type"
                label="Business Type"
                options={BusinessTypeOptions}
                defaultValue={coreInfoDefaultValue.business_type}
                error={this.errors.business_type}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-select
                name="business_structure"
                label="Business Structure"
                options={BusinessStructureOptions}
                defaultValue={coreInfoDefaultValue.business_structure}
                error={this.errors.business_structure}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="industry"
                label="Industry"
                defaultValue={coreInfoDefaultValue.industry}
                error={this.errors.business_structure}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12">
              <form-control-number-masked
                name="tax_id"
                label="Tax ID"
                defaultValue={coreInfoDefaultValue.tax_id}
                error={this.errors.tax_id}
                inputHandler={this.inputHandler}
                mask={TAX_ID_MASKS.US}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Website URL"
                defaultValue={coreInfoDefaultValue.website_url}
                error={this.errors.website_url}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={coreInfoDefaultValue.email}
                error={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={coreInfoDefaultValue.phone}
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
