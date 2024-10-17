import { Component, Host, Prop, State, h } from '@stencil/core';
import { FormController } from '../../../../components';
import { IAddress } from '../../../../api/Business';
import StateOptions from '../../../../utils/state-options';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-legal-address-form'
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress;

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    this.formController.values.subscribe(
      values => (this.legal_address = { ...values.legal_address })
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
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="line1"
                label="Legal Address"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line1}
                errorText={this.errors?.legal_address?.line1}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="line2"
                label="Address Line 2"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.line2}
                errorText={this.errors?.legal_address?.line2}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="city"
                label="City"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.city}
                errorText={this.errors?.legal_address?.city}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="state"
                label="State"
                options={StateOptions}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.state}
                errorText={this.errors?.legal_address?.state}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="postal_code"
                label="Postal Code"
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.postal_code}
                errorText={this.errors?.legal_address?.postal_code}
                maxLength={5}
                keyDownHandler={numberOnlyHandler}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="country"
                label="Country"
                options={[{ label: 'United States', value: 'USA' }]}
                inputHandler={this.inputHandler}
                defaultValue={legalAddressDefaultValue?.country}
                errorText={this.errors?.legal_address?.country}
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
