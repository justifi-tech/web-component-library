import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { FormController } from '../../../../components';
import { Address,IAddress } from '../../../../api/Business';
import { PaymentProvisioningCountryOptions } from '../../../../utils/address-form-helpers';
import { heading2 } from '../../../../styles/parts';
import { getCountryFormConfig } from '../../utils';

@Component({
  tag: 'justifi-legal-address-form'
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() address: IAddress = new Address({});
  @State() currentCountry: string = '';

  private stateControlRef!: HTMLElement;
  private postalCodeControlRef!: HTMLElement;


  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors.legal_address || {} }),
    );
    // Initialize currentCountry from defaultValues
    const defaultValues = this.formController.getInitialValues().legal_address || {};
    this.currentCountry = defaultValues?.country;
  }

  @Watch('address')
  handleAddressChange(newValues: any) {
    const currentValues = this.formController.values.getValue();
    this.formController.setValues({
      ...currentValues,
      legal_address: {
        ...currentValues.legal_address,
        ...newValues,
      },
    });
  }

  @Watch('formController')
  handleFormControllerChange() {
    // Update current country when form controller changes (e.g., after API call)
    const defaultValues = this.formController.getInitialValues().legal_address || {};
    if (defaultValues?.country && !this.currentCountry) {
      this.currentCountry = defaultValues.country;
    }
  }

  private handleCountryChange = (value: string) => {
    // Clear `state` and `postal_code` fields when country changes
    this.address = {
      ...this.address,
      country: value,
      state: '',
      postal_code: '',
    };
    
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
    if (name === 'country') {
      this.handleCountryChange(value);
    } else {
      // Regular field update
      this.address = {
        ...this.address,
        [name]: value
      };
    }
  }

  render() {
    const defaultValues = this.formController.getInitialValues().legal_address || {};
    
    const {
      regionOptions,
      regionLabel,
      postalCodeLabel,
      postalCodeConfig,
      postalCodeHelpText
    } = getCountryFormConfig(this.currentCountry);

    return (
      <Host>
        <fieldset>
          <legend part={heading2}>Business Legal Address</legend>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={PaymentProvisioningCountryOptions}
                inputHandler={this.inputHandler}
                defaultValue={defaultValues?.country}
                errorText={this.errors?.country}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={defaultValues?.line1}
                errorText={this.errors?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2 (optional)"
                inputHandler={this.inputHandler}
                defaultValue={defaultValues?.line2}
                errorText={this.errors?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={defaultValues?.city}
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
                defaultValue={defaultValues?.state}
                errorText={this.errors?.state}
              />
            </div>
            <div class="col-12">
              <form-control-text
                ref={(el) => this.postalCodeControlRef = el}
                name="postal_code"
                label={postalCodeLabel}
                inputHandler={this.inputHandler}
                defaultValue={defaultValues?.postal_code}
                errorText={this.errors?.postal_code}
                maxLength={postalCodeConfig.maxLength}
                keyDownHandler={postalCodeConfig.keyDownHandler}
                helpText={postalCodeHelpText}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
