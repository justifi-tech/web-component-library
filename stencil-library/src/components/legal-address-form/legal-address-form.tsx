import { Component, Host, Prop, State, h } from '@stencil/core';
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
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @Prop() legend: string;
  @State() errors: any = {};
  @State() legal_address: any = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    this.formController.values.subscribe(
      values => (this.legal_address = { ...values.legal_address }),
    );
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      legal_address: {
        ...this.formController.values.getValue().legal_address,
        [name]: value,
      },
    });
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset class="mb-4">
          {this.legend && <legend>{this.legend}</legend>}
          <div class="row gx-2 gy-2">
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={this.legal_address?.line1}
                error={this.errors?.legal_address?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2"
                inputHandler={(name, value) => this.inputHandler(name, value)}
                defaultValue={this.legal_address?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={this.legal_address?.city}
                error={this.errors?.legal_address?.city}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="state"
                label="State"
                inputHandler={this.inputHandler}
                defaultValue={this.legal_address?.state}
                error={this.errors?.legal_address?.state}
              />
            </div>
            <div class="col-12">
              <form-control-number
                name="postal_code"
                label="Zip"
                inputHandler={this.inputHandler}
                defaultValue={this.legal_address?.postal_code}
                error={this.errors?.legal_address?.postal_code}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={countryOptions}
                inputHandler={this.inputHandler}
                defaultValue={this.legal_address?.country}
                error={this.errors?.legal_address?.country}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
