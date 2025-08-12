import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { businessCoreInfoSchema } from '../../schemas/business-core-info-schema';
import { FormController } from '../../../../ui-components/form/form';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../../api/Business';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { BusinessFormStep, businessClassificationOptions } from '../../utils';
import { PHONE_MASKS, TAX_ID_MASKS } from '../../../../utils/form-input-masks';
import { DEFAULT_COUNTRY } from '../../../../utils/constants';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';

@Component({
  tag: 'justifi-business-core-info-form-step-core',
})
export class BusinessCoreInfoFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() coreInfo: ICoreBusinessInfo = {};
  @State() country: string = DEFAULT_COUNTRY;
  @State() taxIdLabel: string = 'Tax ID (EIN or SSN)';
  @State() taxIdHelpText: string = 'Enter your EIN or SSN (9 digits, no dashes)';
  @State() taxIdMask: string = TAX_ID_MASKS.US;
  @State() isLoading: boolean = false;

  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading event
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  get patchPayload() {
    let formValues = new CoreBusinessInfo(this.formController.values.getValue()).payload;
    return formValues;
  }

  async componentWillLoad() {
    if (this.getBusiness) {
      await this.getData();
    }
    this.setupFormController();
    this.setLabelsForCountry();
  }

  private setupFormController() {
    this.formController = new FormController(businessCoreInfoSchema(this.allowOptionalFields, this.country));
    this.formController.setInitialValues({ ...this.coreInfo });
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private getData = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.formLoading.emit(true);
      this.isLoading = true;
      this.getBusiness({
        onSuccess: (response) => {
          this.country = response.data.legal_address?.country || DEFAULT_COUNTRY;
          this.coreInfo = new CoreBusinessInfo(response.data);
          resolve();
        },
        onError: ({ error, code, severity }) => {
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity
          });
          reject(error);
        },
        final: () => {
          this.formLoading.emit(false);
          this.isLoading = false;
        }
      });
    });
  }

  private setLabelsForCountry() {
    const isCanadian = this.country === 'CAN';
    
    if (isCanadian) {
      this.taxIdLabel = 'Business Number';
      this.taxIdHelpText = 'Enter your Business Number (9 digits)';
      this.taxIdMask = TAX_ID_MASKS.CA;
    } else {
      this.taxIdLabel = 'Tax ID (EIN or SSN)';
      this.taxIdHelpText = 'Enter your EIN or SSN (9 digits, no dashes)';
      this.taxIdMask = TAX_ID_MASKS.US;
    }
  }

  private sendData = (onSuccess: () => void) => {
    let submittedData;
    this.formLoading.emit(true);
    this.patchBusiness({
      payload: this.patchPayload,
      onSuccess: (response) => {
        submittedData = response;
        onSuccess();
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
                helpText="Describe what you sell"
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
