import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { FormController } from '../../../../components';
import { IAddress } from '../../../../api/Business';
import { PaymentProvisioningCountryOptions } from '../../../../utils/address-form-helpers';
import { heading2 } from '../../../../styles/parts';
import { getCountryFormConfig } from '../../utils';

@Component({
  tag: 'justifi-legal-address-form'
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @Prop() defaultValues: IAddress;
  @State() errors: any = {};
  @State() currentCountry: string = '';

  private stateControlRef!: HTMLElement;
  private postalCodeControlRef!: HTMLElement;

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors.legal_address || {} }),
    );
  }

  @Watch('defaultValues')
  handleDefaultValuesChange(newValues: any) {
    if (newValues) {
      this.currentCountry = this.defaultValues.country;
    }
  }

  private handleCountryChange = (currentValues: any, value: string) => {
    // Clear `state` and `postal_code` fields when country changes
    this.formController.setValues({ legal_address: {
      ...currentValues.legal_address,
      country: value,
      state: '',
      postal_code: '',
    }});
    
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
      this.formController.setValues({ legal_address: {
        ...currentValues.legal_address,
        [name]: value,
      }});
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
                defaultValue={this.defaultValues?.country}
                errorText={this.errors?.country}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues?.line1}
                errorText={this.errors?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2 (optional)"
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues?.line2}
                errorText={this.errors?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues?.city}
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
                defaultValue={this.defaultValues?.state}
                errorText={this.errors?.state}
              />
            </div>
            <div class="col-12">
              <form-control-text
                ref={(el) => this.postalCodeControlRef = el}
                name="postal_code"
                label={postalCodeLabel}
                inputHandler={this.inputHandler}
                defaultValue={this.defaultValues?.postal_code}
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
