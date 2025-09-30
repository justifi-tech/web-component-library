import { Component, h, Prop } from '@stencil/core';
import { bankAccountTypeOptions } from '../../utils';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';

@Component({
  tag: 'bank-account-form-inputs'
})
export class BankAccountFormInputs {
  @Prop() defaultValue: any;
  @Prop() errors: any;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() formDisabled: boolean;

  private renderInputs() {
    return [
      (
        <div class="col-12">
          <form-control-text
            name="bank_name"
            label="Bank Name"
            defaultValue={this.defaultValue.bank_name}
            errorText={this.errors.bank_name}
            inputHandler={this.inputHandler}
          />
        </div>
      ),
      (
        <div class="col-12">
          <form-control-text
            name="nickname"
            label="Nickname"
            defaultValue={this.defaultValue.nickname}
            errorText={this.errors.nickname}
            inputHandler={this.inputHandler}
          />
        </div>
      ),
      (
        <div class="col-12">
          <form-control-text
            name="account_owner_name"
            label="Account Owner Name"
            defaultValue={this.defaultValue.account_owner_name}
            errorText={this.errors.account_owner_name}
            inputHandler={this.inputHandler}
          />
        </div>
      ),
      (
        <div class="col-12">
          <form-control-select
            name="account_type"
            label="Account Type"
            options={bankAccountTypeOptions}
            defaultValue={this.defaultValue.account_type}
            errorText={this.errors.account_type}
            inputHandler={this.inputHandler}
          />
        </div>
      ),
      (
        <div class="col-6">
          <form-control-text
            name="account_number"
            label="Account Number"
            defaultValue={this.defaultValue.account_number}
            maxLength={17}
            errorText={this.errors.account_number}
            inputHandler={this.inputHandler}
            keyDownHandler={numberOnlyHandler}
            helpText="Please copy the account number as shown on your statement/check. Do not include spaces or dashes."
          />
        </div>
      ),
      (
        <div class="col-6">
          <form-control-text
            name="routing_number"
            label="Routing Number"
            defaultValue={this.defaultValue.routing_number}
            maxLength={9}
            errorText={this.errors.routing_number}
            inputHandler={this.inputHandler}
            keyDownHandler={numberOnlyHandler}
            helpText="A valid routing number is nine digits. Please include any leading or trailing zeroes."
          />
        </div>
      ),
    ];
  }

  private renderReadOnly() {
    return [
      (
        <div class="col-12">
          <bank-account-read-only-value label="Bank Name" value={this.defaultValue?.bank_name} />
        </div>
      ),
      (
        <div class="col-12">
          <bank-account-read-only-value label="Nickname" value={this.defaultValue?.nickname} />
        </div>
      ),
      (
        <div class="col-12">
          <bank-account-read-only-value label="Account Owner Name" value={this.defaultValue?.account_owner_name} />
        </div>
      ),
      (
        <div class="col-12">
          <bank-account-read-only-value label="Account Type" value={this.defaultValue?.account_type} />
        </div>
      ),
      (
        <div class="col-6">
          <bank-account-read-only-value label="Account Number" value={this.defaultValue?.acct_last_four ? `**** ${this.defaultValue.acct_last_four}` : ''} />
        </div>
      ),
      (
        <div class="col-6">
          <bank-account-read-only-value label="Routing Number" value={this.defaultValue?.routing_number || ''} />
        </div>
      ),
    ];
  }

  render() {
    return <div class="row gy-3">{this.formDisabled ? this.renderReadOnly() : this.renderInputs()}</div>;
  }
}
