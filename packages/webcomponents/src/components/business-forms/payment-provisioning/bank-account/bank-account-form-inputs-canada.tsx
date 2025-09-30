import { Component, h, Prop } from '@stencil/core';
import { bankAccountTypeOptions } from '../../utils';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';
import { text } from '../../../../styles/parts';

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
          {this.formDisabled ? (
            <bank-account-read-only-value label="Bank Name" value={this.defaultValue?.bank_name} />
          ) : (
            <form-control-text
              name="bank_name"
              label="Bank Name"
              defaultValue={this.defaultValue.bank_name}
              errorText={this.errors.bank_name}
              inputHandler={this.inputHandler}
            />
          )}
        </div>
        <div class="col-12">
          {this.formDisabled ? (
            <bank-account-read-only-value label="Nickname" value={this.defaultValue?.nickname} />
          ) : (
            <form-control-text
              name="nickname"
              label="Nickname"
              defaultValue={this.defaultValue.nickname}
              errorText={this.errors.nickname}
              inputHandler={this.inputHandler}
            />
          )}
        </div>
        <div class="col-12">
          {this.formDisabled ? (
            <bank-account-read-only-value label="Account Owner Name" value={this.defaultValue?.account_owner_name} />
          ) : (
            <form-control-text
              name="account_owner_name"
              label="Account Owner Name"
              defaultValue={this.defaultValue.account_owner_name}
              errorText={this.errors.account_owner_name}
              inputHandler={this.inputHandler}
            />
          )}
        </div>
        <div class="col-12">
          {this.formDisabled ? (
            <bank-account-read-only-value label="Account Type" value={this.defaultValue?.account_type} />
          ) : (
            <form-control-select
              name="account_type"
              label="Account Type"
              options={bankAccountTypeOptions}
              defaultValue={this.defaultValue.account_type}
              errorText={this.errors.account_type}
              inputHandler={this.inputHandler}
            />
          )}
        </div>
        <div class="col-3">
          {this.formDisabled ? (
            <div>
              <label class="form-label" part={text}>Transit Number</label>
              <div part={text}>{this.defaultValue?.transit_number || ''}</div>
            </div>
          ) : (
            <form-control-text
              name="transit_number"
              label="Transit Number"
              defaultValue={this.defaultValue.transit_number}
              maxLength={5}
              errorText={this.errors.transit_number}
              inputHandler={this.inputHandler}
              keyDownHandler={numberOnlyHandler}
              helpText="5 digits"
            />
          )}
        </div>
        <div class="col-3">
          {this.formDisabled ? (
            <div>
              <label class="form-label" part={text}>Institution Number</label>
              <div part={text}>{this.defaultValue?.institution_number || ''}</div>
            </div>
          ) : (
            <form-control-text
              name="institution_number"
              label="Institution Number"
              defaultValue={this.defaultValue.institution_number}
              maxLength={3}
              errorText={this.errors.institution_number}
              inputHandler={this.inputHandler}
              keyDownHandler={numberOnlyHandler}
              helpText="3 digits"
            />
          )}
        </div>
        <div class="col-6">
          {this.formDisabled ? (
            <div>
              <label class="form-label" part={text}>Account Number</label>
              <div part={text}>{this.defaultValue?.acct_last_four ? `**** ${this.defaultValue.acct_last_four}` : ''}</div>
            </div>
          ) : (
            <form-control-text
              name="account_number"
              label="Account Number"
              defaultValue={this.defaultValue.account_number}
              maxLength={17}
              errorText={this.errors.account_number}
              inputHandler={this.inputHandler}
              keyDownHandler={numberOnlyHandler}
              helpText="Please copy the account number as shown on your statement. Do not include spaces or dashes."
            />
          )}
        </div>
      </div>
    );
  }
}


