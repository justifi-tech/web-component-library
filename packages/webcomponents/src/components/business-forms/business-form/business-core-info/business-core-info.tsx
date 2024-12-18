import { Component, Host, h, Prop, State } from '@stencil/core';
import { businessClassificationOptions } from '../../utils/business-form-options';
import { FormController } from '../../../../ui-components/form/form';
import { PHONE_MASKS, TAX_ID_MASKS } from '../../../../utils/form-input-masks';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../../api/Business';
import { heading2 } from '../../../../styles/parts';

/**
 *
 * The difference between this component and business-core-info-details
 * is that this component is meant to be a form and send data
 * and the other one  is meant to be just read only.
 *
 */
@Component({
  tag: 'justifi-business-core-info'
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
      <Host>
        <fieldset>
          <legend part={heading2}>General Info</legend>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="legal_name"
                label="Legal Name"
                defaultValue={coreInfoDefaultValue.legal_name}
                errorText={this.errors.legal_name}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={coreInfoDefaultValue.doing_business_as}
                errorText={this.errors.doing_business_as}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-8">
              <form-control-select
                name="classification"
                label="Business Classification"
                options={businessClassificationOptions}
                defaultValue={coreInfoDefaultValue.classification}
                errorText={this.errors.classification}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-4">
              <form-control-date
                name="date_of_incorporation"
                label="Date of Incorporation"
                defaultValue={coreInfoDefaultValue.date_of_incorporation}
                errorText={this.errors.date_of_incorporation}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="industry"
                label="Industry"
                defaultValue={coreInfoDefaultValue.industry}
                errorText={this.errors.industry}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="tax_id"
                label="Tax ID"
                defaultValue={coreInfoDefaultValue.tax_id}
                errorText={this.errors.tax_id}
                inputHandler={this.inputHandler}
                mask={TAX_ID_MASKS.US}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Website URL"
                defaultValue={coreInfoDefaultValue.website_url}
                errorText={this.errors.website_url}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Email Address"
                defaultValue={coreInfoDefaultValue.email}
                errorText={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Phone Number"
                defaultValue={coreInfoDefaultValue.phone}
                errorText={this.errors.phone}
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
