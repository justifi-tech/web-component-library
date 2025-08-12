import { Component, Host, h, Prop, State } from '@stencil/core';
import { businessClassificationOptions } from '../../utils/business-form-options';
import { FormController } from '../../../../ui-components/form/form';
import { PHONE_MASKS, TAX_ID_MASKS } from '../../../../utils/form-input-masks';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../../api/Business';
import { heading2 } from '../../../../styles/parts';

// Tax ID / Business Number labels and help text
const TAX_ID_LABEL_US = 'Tax ID (EIN or SSN)';
const TAX_ID_HELP_US = 'Enter your EIN or SSN (9 digits, no dashes)';
const TAX_ID_LABEL_CAN = 'Business Number';
const TAX_ID_HELP_CAN = 'Enter your Business Number (9 digits, no dashes)';

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
  @State() country: string = 'USA';
  @State() taxIdLabel: string = TAX_ID_LABEL_US;
  @State() taxIdHelpText: string = TAX_ID_HELP_US;
  @State() taxIdMask: string = TAX_ID_MASKS.US;

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.values.subscribe(
      values => {
        this.coreInfo = { ...new CoreBusinessInfo(values) };
        const nextCountry = values?.legal_address?.country || 'USA';
        if (nextCountry !== this.country) {
          this.country = nextCountry;
          this.setLabelsAndMaskForCountry();
        }
      },
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });

    // Initialize once with initial values
    const initial = this.formController.getInitialValues();
    this.country = initial?.legal_address?.country || 'USA';
    this.setLabelsAndMaskForCountry();
  }

  private setLabelsAndMaskForCountry() {
    const isCanadian = this.country === 'CAN';
    if (isCanadian) {
      this.taxIdLabel = TAX_ID_LABEL_CAN;
      this.taxIdHelpText = TAX_ID_HELP_CAN;
      this.taxIdMask = TAX_ID_MASKS.CA;
    } else {
      this.taxIdLabel = TAX_ID_LABEL_US;
      this.taxIdHelpText = TAX_ID_HELP_US;
      this.taxIdMask = TAX_ID_MASKS.US;
    }
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
                label={this.taxIdLabel}
                defaultValue={coreInfoDefaultValue.tax_id}
                errorText={this.errors.tax_id}
                inputHandler={this.inputHandler}
                mask={this.taxIdMask}
                helpText={this.taxIdHelpText}
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
