import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { FormController } from '../form/form';
import countryOptions from '../../utils/country-options';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-legal-address-form',
  styleUrl: 'legal-address-form.scss',
  shadow: true,
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @Prop() legend: string;
  @State() errors: any = {};
  @State() defaultValues: any = {};
  @State() legalAddress: any = {};

  @Watch('legalAddress')
  handleLegalAddressChange(newValue: any) {
    this.formController.setValues({ legalAddress: newValue });
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => (this.errors = { ...errors }));
    this.formController.defaultValues.subscribe(defaultValues => (this.defaultValues = { ...defaultValues }));
  }

  inputHandler(name: string, value: string) {
    this.legalAddress = { ...this.legalAddress, [name]: value };
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset class="mb-4">
          {this.legend && <legend>{this.legend}</legend>}
          <div class="row gx-2 gy-2">
            <div class="col-12">
              <form-control-text name="line1" label="Legal Address" inputHandler={(name, value) => this.inputHandler(name, value)} error={this.errors?.legalAddress?.line1} />
            </div>
            <div class="col-12">
              <form-control-text name="line2" label="Address Line 2" inputHandler={(name, value) => this.inputHandler(name, value)} />
            </div>
            <div class="col-12">
              <form-control-text name="city" label="City" inputHandler={(name, value) => this.inputHandler(name, value)} error={this.errors?.legalAddress?.city} />
            </div>
            <div class="col-12">
              <form-control-text name="state" label="State" inputHandler={(name, value) => this.inputHandler(name, value)} error={this.errors?.legalAddress?.state} />
            </div>
            <div class="col-12">
              <form-control-text name="postal_code" label="Zip" inputHandler={(name, value) => this.inputHandler(name, value)} error={this.errors?.legalAddress?.postal_code} />
            </div>
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={countryOptions}
                inputHandler={(name, value) => this.inputHandler(name, value)}
                error={this.errors?.legalAddress?.country}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
