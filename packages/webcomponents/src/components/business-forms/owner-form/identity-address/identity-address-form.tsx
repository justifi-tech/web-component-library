import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { PaymentProvisioningCountryOptions } from '../../../../utils/address-form-helpers';
import { IAddress } from '../../../../api/Business';
import { getCountryFormConfig } from '../../utils';

@Component({
  tag: 'justifi-identity-address-form'
})
export class IdentityAddressForm {
  @Prop() handleFormUpdate: (values: any) => void;
  @Prop() errors: any;
  @Prop() defaultValues: any;
  @State() address: IAddress = {};
  @State() currentCountry: string = '';

  private stateControlRef!: HTMLElement;
  private postalCodeControlRef!: HTMLElement;

  componentDidLoad() {
    // Initialize currentCountry from defaultValues
    this.currentCountry = this.defaultValues?.country || '';
  }

  @Watch('address')
  handleAddressChange(newValues: any) {
    this.handleFormUpdate(newValues);
  }

  @Watch('defaultValues')
  handleDefaultValuesChange(newValues: any) {
    // Update current country when default values change
    if (newValues?.country) {
      this.currentCountry = newValues.country;
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
    const {
      regionOptions,
      regionLabel,
      postalCodeLabel,
      postalCodeConfig,
      postalCodeHelpText
    } = getCountryFormConfig(this.currentCountry || this.address?.country || this.defaultValues?.country);

    return (
      <Host>
        <div class="row gy-3">
          <div class="col-12">
            <form-control-select
              name="country"
              label="Country"
              options={PaymentProvisioningCountryOptions}
              inputHandler={this.inputHandler}
              defaultValue={this.defaultValues?.country || ''}
              errorText={this.errors?.country}
            />
          </div>
          <div class="col-12 col-md-8">
            <form-control-text
              name="line1"
              label="Street Address"
              defaultValue={this.defaultValues?.line1}
              errorText={this.errors?.line1}
              inputHandler={this.inputHandler}
              helpText="​​Enter your address exactly as stated on your driver's license. No PO Boxes."
            />
          </div>
          <div class="col-12 col-md-4">
            <form-control-text
              name="line2"
              label="Apartment, Suite, etc. (optional)"
              defaultValue={this.defaultValues?.line2}
              errorText={this.errors?.line2}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="city"
              label="City"
              defaultValue={this.defaultValues?.city}
              errorText={this.errors?.city}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-select
              ref={(el) => this.stateControlRef = el}
              name="state"
              label={regionLabel}
              defaultValue={this.defaultValues?.state}
              options={regionOptions}
              errorText={this.errors?.state}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12 col-md-6">
            <form-control-text
              ref={(el) => this.postalCodeControlRef = el}
              name="postal_code"
              label={postalCodeLabel}
              defaultValue={this.defaultValues?.postal_code}
              errorText={this.errors?.postal_code}
              maxLength={postalCodeConfig.maxLength}
              keyDownHandler={postalCodeConfig.keyDownHandler}
              inputHandler={this.inputHandler}
              helpText={postalCodeHelpText}
            />
          </div>
        </div>
      </Host>
    );
  }
}
