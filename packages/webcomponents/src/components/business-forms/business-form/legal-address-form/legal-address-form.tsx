import { Component, Host, Prop, State, h } from '@stencil/core';
import { FormController } from '../../../../components';
import { IAddress } from '../../../../api/Business';
import { heading2 } from '../../../../styles/parts';
import { CountryCode } from '../../../../utils/country-codes';

@Component({
  tag: 'justifi-legal-address-form'
})
export class LegalAddressForm {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress;
  @Prop() country: CountryCode;

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
      <Host>
        <fieldset>
          <legend part={heading2}>Business Legal Address</legend>
          <justifi-form-address-fields
            country={this.country}
            errors={this.errors?.legal_address}
            defaultValues={legalAddressDefaultValue}
            inputHandler={this.inputHandler}
          />
        </fieldset>
      </Host>
    );
  }
}
