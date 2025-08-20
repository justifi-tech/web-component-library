import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { CountryCode } from '../../../../utils/country-codes';
import { IAddress } from '../../../../api/Business';

@Component({
  tag: 'justifi-identity-address-form'
})
export class IdentityAddressForm {
  @Prop() handleFormUpdate: (values: any) => void;
  @Prop() errors: any;
  @Prop() defaultValues: any;
  @Prop() country: CountryCode;
  @State() address: IAddress = {};

  @Watch('address')
  handleAddressChange(newValues: any) {
    this.handleFormUpdate(newValues);
  }

  inputHandler = (name: string, value: string) => {
    this.address[name] = value;
    this.address = { ...this.address };
  }

  render() {
    return (
      <Host>
        <justifi-form-address-fields
          country={this.country}
          errors={this.errors}
          defaultValues={this.defaultValues}
          inputHandler={this.inputHandler}
        />
      </Host>
    );
  }
}
