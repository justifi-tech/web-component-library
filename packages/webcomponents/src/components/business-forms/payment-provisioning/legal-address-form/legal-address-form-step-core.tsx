import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { legalAddressSchema } from '../../schemas/business-address-schema';
import { FormController } from '../../../../ui-components/form/form';
import { Address, IAddress } from '../../../../api/Business';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import StateOptions from '../../../../utils/state-options';
import CanadianProvinceOptions from '../../../../utils/canadian-province-options';
import countryOptions from '../../../../utils/country-options';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormStep } from '../../utils';

@Component({
  tag: 'justifi-legal-address-form-step-core'
})
export class LegalAddressFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress = {};
  @State() isLoading: boolean = false;
  @State() selectedCountry: string = 'US'; // Default to US

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
    this.initializeFormController();
  }

  initializeFormController() {
    this.formController = new FormController(legalAddressSchema(this.allowOptionalFields, this.selectedCountry));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        this.legal_address = new Address(response.data.legal_address || {});
        // Set selected country from loaded data, default to US if not set
        this.selectedCountry = this.legal_address.country || 'US';
        // Reinitialize form controller with the correct country
        this.initializeFormController();
        this.formController.setInitialValues({ ...this.legal_address });
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

  inputHandler = (name: string, value: string) => {
    // Handle country changes
    if (name === 'country') {
      this.selectedCountry = value;
      // Clear state/province when country changes
      const currentValues = this.formController.values.getValue();
      this.formController.setValues({
        ...currentValues,
        [name]: value,
        state: '', // Clear state when country changes
      });
      // Reinitialize form controller with new country-aware validation
      this.initializeFormController();
      // Restore form values except for state
      this.formController.setValues({
        ...currentValues,
        [name]: value,
        state: '', // Keep state cleared
      });
    } else {
      this.formController.setValues({
        ...this.formController.values.getValue(),
        [name]: value,
      });
    }
  }

  getStateOptions() {
    if (this.selectedCountry === 'CA') {
      return CanadianProvinceOptions;
    } else {
      return StateOptions; // Default to US states
    }
  }

  getCountryOptions() {
    // Return only US and Canada for now, as per requirements
    return countryOptions.filter(option => 
      option.value === '' || option.value === 'US' || option.value === 'CA'
    );
  }

  getPostalCodeProps() {
    if (this.selectedCountry === 'CA') {
      return {
        label: 'Postal Code',
        maxLength: 7, // A1A 1A1
        placeholder: 'A1A 1A1'
      };
    } else {
      return {
        label: 'ZIP Code',
        maxLength: 10, // 12345-6789
        placeholder: '12345'
      };
    }
  }

  postalCodeKeyHandler = (e: KeyboardEvent) => {
    // Allow numbers, dash, backspace, delete, tab, escape, enter, home, end, arrow keys
    const allowedKeys = [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40, 189, 109]; // Include dash (189, 109)
    const isNumber = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
    
    if (!allowedKeys.includes(e.keyCode) && !isNumber) {
      e.preventDefault();
    }
  }

  render() {
    const legalAddressDefaultValue = this.formController.getInitialValues();

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
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line1}
                errorText={this.errors?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2 (optional)"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line2}
                errorText={this.errors?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.city}
                errorText={this.errors?.city}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={this.getCountryOptions()}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.country}
                errorText={this.errors?.country}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="state"
                label={this.selectedCountry === 'CA' ? 'Province/Territory' : 'State'}
                options={this.getStateOptions()}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.state}
                errorText={this.errors?.state}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="postal_code"
                label={this.getPostalCodeProps().label}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.postal_code}
                errorText={this.errors?.postal_code}
                maxLength={this.getPostalCodeProps().maxLength}
                placeholder={this.getPostalCodeProps().placeholder}
                keyDownHandler={this.selectedCountry === 'CA' ? undefined : this.postalCodeKeyHandler}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
