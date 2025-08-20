import { Component, h, Prop } from '@stencil/core';
import { bankAccountTypeOptions } from '../../utils';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';

@Component({
  tag: 'bank-account-form-inputs-canada'
})
export class BankAccountFormInputsCanada {
  @Prop() defaultValue: any;
  @Prop() errors: any;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() formDisabled: boolean;

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <form-control-text
            name="bank_name"
            label="Bank Name"
            defaultValue={this.defaultValue.bank_name}
            errorText={this.errors.bank_name}
            inputHandler={this.inputHandler}
            disabled={this.formDisabled}
          />
        </div>
        <div class="col-12">
          <form-control-text
            name="nickname"
            label="Nickname"
            defaultValue={this.defaultValue.nickname}
            errorText={this.errors.nickname}
            inputHandler={this.inputHandler}
            disabled={this.formDisabled}
          />
        </div>
        <div class="col-12">
          <form-control-text
            name="account_owner_name"
            label="Account Owner Name"
            defaultValue={this.defaultValue.account_owner_name}
            errorText={this.errors.account_owner_name}
            inputHandler={this.inputHandler}
            disabled={this.formDisabled}
          />
        </div>
        <div class="col-12">
          <form-control-select
            name="account_type"
            label="Account Type"
            options={bankAccountTypeOptions}
            defaultValue={this.defaultValue.account_type}
            errorText={this.errors.account_type}
            inputHandler={this.inputHandler}
            disabled={this.formDisabled}
          />
        </div>
        <div class="col-3">
          <form-control-text
            name="transit_number"
            label="Transit Number"
            defaultValue={this.defaultValue.transit_number}
            maxLength={5}
            errorText={this.errors.transit_number}
            inputHandler={this.inputHandler}
            keyDownHandler={numberOnlyHandler}
            disabled={this.formDisabled}
            helpText="5 digits"
          />
        </div>
        <div class="col-3">
          <form-control-text
            name="institution_number"
            label="Institution Number"
            defaultValue={this.defaultValue.institution_number}
            maxLength={3}
            errorText={this.errors.institution_number}
            inputHandler={this.inputHandler}
            keyDownHandler={numberOnlyHandler}
            disabled={this.formDisabled}
            helpText="3 digits"
          />
        </div>
        <div class="col-6">
          <form-control-text
            name="account_number"
            label="Account Number"
            defaultValue={this.defaultValue.account_number}
            maxLength={17}
            errorText={this.errors.account_number}
            inputHandler={this.inputHandler}
            keyDownHandler={numberOnlyHandler}
            disabled={this.formDisabled}
            helpText="Please copy the account number as shown on your statement. Do not include spaces or dashes."
          />
        </div>
      </div>
    );
  }
}


