import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { addressSchema } from '../../schemas/business-address-schema';
import { FormController } from '../../../../ui-components/form/form';
import { Address, IAddress } from '../../../../api/Business';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { PaymentProvisioningCountryOptions } from '../../../../utils/address-form-helpers';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormStep, getCountryFormConfig } from '../../utils';

@Component({
  tag: 'justifi-legal-address-form-step-core'
})
export class LegalAddressFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() isLoading: boolean = false;
  @State() currentCountry: string = '';
  @State() defaultValues: IAddress = new Address({});

  private stateControlRef!: HTMLElement;
  private postalCodeControlRef!: HTMLElement;

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
    let formValues = new Address(this.formController.values.getValue()).payload;
    return { legal_address: formValues };
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(addressSchema(this.allowOptionalFields));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        const legalAddress = new Address(response.data.legal_address || {});
        this.formController.setInitialValues({ ...legalAddress });
        this.defaultValues = this.formController.getInitialValues();
        this.currentCountry = this.defaultValues.country;
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
        this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.legalAddress });
        this.formLoading.emit(false)
      }
    });
  }

  private handleCountryChange = (currentValues: any, value: string) => {
    // Clear `state` and `postal_code` fields when country changes
    this.formController.setValues({
      ...currentValues,
      country: value,
      state: '',
      postal_code: '',
    });
    
    // Update state to trigger re-render for labels
    this.currentCountry = value;
    
    // Force update the form controls to show cleared values
    if (this.stateControlRef && (this.stateControlRef as any).updateInput) {
      (this.stateControlRef as any).updateInput('');
    }
    if (this.postalCodeControlRef && (this.postalCodeControlRef as any).updateInput) {
      (this.postalCodeControlRef as any).updateInput('');
    }
  }

  inputHandler = (name: string, value: string) => {
    const currentValues = this.formController.values.getValue();
    if (name === 'country') {
      this.handleCountryChange(currentValues, value);
    } else {
      // Regular field update
      this.formController.setValues({
        ...currentValues,
        [name]: value,
      });
    }
  }

  render() {
    const {
      regionOptions,
      regionLabel,
      postalCodeLabel,
      postalCodeConfig,
      postalCodeHelpText
    } = getCountryFormConfig(this.currentCountry);

    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Legal Address of your Business</legend>
            <form-control-tooltip helpText="No PO Boxes." />
          </div>
          <hr class="mt-2" />
          <div class="row gy-3">
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={PaymentProvisioningCountryOptions}
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues.country}
                errorText={this.errors?.country}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues.line1}
                errorText={this.errors?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2 (optional)"
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues.line2}
                errorText={this.errors?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues.city}
                errorText={this.errors?.city}
              />
            </div>
            <div class="col-12">
              <form-control-select
                ref={(el) => this.stateControlRef = el}
                name="state"
                label={regionLabel}
                options={regionOptions}
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues.state}
                errorText={this.errors?.state}
              />
            </div>
            <div class="col-12">
              <form-control-text
                ref={(el) => this.postalCodeControlRef = el}
                name="postal_code"
                label={postalCodeLabel}
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues.postal_code}
                errorText={this.errors?.postal_code}
                maxLength={postalCodeConfig.maxLength}
                keyDownHandler={postalCodeConfig.keyDownHandler}
                helpText={postalCodeHelpText}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
