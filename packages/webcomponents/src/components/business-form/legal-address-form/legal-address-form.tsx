import { Component, Host, Prop, State, h } from '@stencil/core';
import { FormController } from '../../form/form';
import countryOptions from '../../../utils/country-options';

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
    const legalAddressDefaultValue =
      this.formController.getInitialValues().legal_address;

    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Business Legal Address</legend>
          <hr />
          <div class="row gx-2 gy-2">
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line1}
                error={this.errors?.legal_address?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2"
                inputHandler={(name, value) => this.inputHandler(name, value)}
                defaultValue={legalAddressDefaultValue?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.city}
                error={this.errors?.legal_address?.city}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="state"
                label="State"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.state}
                error={this.errors?.legal_address?.state}
              />
            </div>
            <div class="col-12">
              <form-control-number
                name="postal_code"
                label="Postal Code"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.postal_code}
                error={this.errors?.legal_address?.postal_code}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={[{ label: 'United States', value: 'USA' }]}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.country}
                error={this.errors?.legal_address?.country}
                // just for now so we skip handling country specificities
                disabled={true}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
