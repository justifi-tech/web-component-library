import { Component, h, Prop, State, Event, EventEmitter, Watch, Method } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { CountryCode } from '../../../../utils/country-codes';
import { businessCoreInfoSchemaUSA, businessCoreInfoSchemaCAN } from '../../schemas/business-core-info-schema';
import { FormController } from '../../../../ui-components/form/form';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../../api/Business';
import { BusinessFormStep, businessClassificationOptions } from '../../utils';
import { PHONE_MASKS } from '../../../../utils/form-input-masks';
import { heading2, label, inputDisabled, buttonSecondary } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { countryLabels } from '../../utils/country-config';

@Component({
  tag: 'justifi-business-core-info-form-step'
})
export class BusinessCoreInfoFormStep {
  @State() getBusiness: Function;
  @State() patchBusiness: Function;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() coreInfo: ICoreBusinessInfo = {};
  @State() isLoading: boolean = false;
  @State() isEditingTaxId: boolean = false;

  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country!: CountryCode;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  }

  get patchPayload() {
    let formValues = new CoreBusinessInfo(this.formController.values.getValue()).payload;
    return formValues;
  }

  componentWillLoad() {
    this.initializeApi();
    const schema = (this.country === CountryCode.CAN)
      ? businessCoreInfoSchemaCAN(this.allowOptionalFields)
      : businessCoreInfoSchemaUSA(this.allowOptionalFields);
    this.formController = new FormController(schema);
    this.getData();
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.patchBusiness = makePatchBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
    } else {
      this.errorEvent.emit({
        message: 'Missing required props',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private getData = () => {
    if (!this.getBusiness) return;

    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        this.coreInfo = new CoreBusinessInfo(response.data);
        this.formController.setInitialValues({ ...this.coreInfo });
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.formLoading.emit(false);
        this.isLoading = false;
      }
    });
  }

  private sendData = (onSuccess: () => void) => {
    let submittedData;
    this.formLoading.emit(true);
    this.patchBusiness({
      payload: this.patchPayload,
      onSuccess: (response) => {
        submittedData = response;
        onSuccess();
        // after successful patch, revert back to read-only for tax id
        this.isEditingTaxId = false;
      },
      onError: ({ error, code, severity }) => {
        submittedData = error;
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.businessInfo });
        this.formLoading.emit(false)
      }
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const coreInfoDefaultValue = this.formController.getInitialValues();

    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Business Information</legend>
          </div>
          <hr class="mt-2" />
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="legal_name"
                label="Business Name"
                defaultValue={coreInfoDefaultValue.legal_name}
                errorText={this.errors.legal_name}
                inputHandler={this.inputHandler}
                helpText="Enter this exactly as it appears on your tax records (don't use acronyms or abbreviations unless you registered that way)."
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="doing_business_as"
                label="Doing Business As (DBA)"
                defaultValue={coreInfoDefaultValue.doing_business_as}
                errorText={this.errors.doing_business_as}
                inputHandler={this.inputHandler}
                helpText="Enter this exactly as it appears on your tax records (leave blank if you don't have a registered DBA/trade name)"
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
                label="Date of Registration"
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
                helpText="Describe what you sell"
              />
            </div>
            <div class="col-12 col-md-6">
              {(!this.coreInfo?.tax_id_last4 || this.isEditingTaxId) ? (
                <form-control-number-masked
                  name="tax_id"
                  label={countryLabels[this.country].taxIdLabel}
                  defaultValue={this.isEditingTaxId ? '' : coreInfoDefaultValue.tax_id}
                  errorText={this.errors.tax_id}
                  inputHandler={this.inputHandler}
                  mask={'000000000'}
                  helpText={countryLabels[this.country].taxIdHelpText}
                />
              ) : (
                <div>
                  <label class="form-label" part={label}>
                    {countryLabels[this.country].taxIdLabel}
                  </label>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      class="form-control"
                      part={inputDisabled}
                      value={`****${this.coreInfo?.tax_id_last4}`}
                      disabled />
                    <button
                      class="btn btn-secondary"
                      type="button"
                      part={buttonSecondary}
                      onClick={() => {
                        this.isEditingTaxId = true;
                        // Clear last4-equivalent and current value if any future conditional validation depends on it
                        this.formController.setValues({
                          ...this.formController.values.getValue(),
                          tax_id: '',
                          tax_id_last4: null
                        });
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div class="col-12">
              <form-control-text
                name="website_url"
                label="Business Website URL"
                defaultValue={coreInfoDefaultValue.website_url}
                errorText={this.errors.website_url}
                inputHandler={this.inputHandler}
                helpText="Don't have a live website? You can use your social media business page, app store link, or staging site URL."
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="email"
                label="Business Email Address"
                defaultValue={coreInfoDefaultValue.email}
                errorText={this.errors.email}
                inputHandler={this.inputHandler}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-number-masked
                name="phone"
                label="Business Phone Number"
                defaultValue={coreInfoDefaultValue.phone}
                errorText={this.errors.phone}
                inputHandler={this.inputHandler}
                mask={PHONE_MASKS.US}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
