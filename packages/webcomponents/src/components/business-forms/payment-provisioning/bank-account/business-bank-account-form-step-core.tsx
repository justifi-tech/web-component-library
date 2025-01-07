import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { businessBankAccountSchema } from '../../schemas/business-bank-account-schema';
import { FormController } from '../../../../ui-components/form/form';
import { BankAccount, IBankAccount } from '../../../../api/BankAccount';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { BusinessFormStep, bankAccountTypeOptions } from '../../utils';
import { numberOnlyHandler } from '../../../../ui-components/form/utils';
import { heading2 } from '../../../../styles/parts';

@Component({
  tag: 'justifi-business-bank-account-form-step-core',
})
export class BusinessBankAccountFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() bankAccount: IBankAccount = {};

  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() postBankAccount: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading event
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    if (this.formDisabled) {
      this.stepCompleteEvent.emit({ response: null, formStep: BusinessFormStep.bankAccount, metadata: 'no data submitted' });
      onSuccess();
    } else {
      this.formController.validateAndSubmit(() => this.sendData(onSuccess));
    };
  };

  get postPayload() {
    let formValues = new BankAccount(this.formController.values.getValue()).payload;
    return formValues;
  }

  get formDisabled() {
    return !!this.bankAccount?.id;
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(businessBankAccountSchema(this.allowOptionalFields));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.getBusiness({
      onSuccess: (response) => {
        if (response.data.bank_accounts.length > 0) {
          this.bankAccount = new BankAccount(response.data.bank_accounts[0]);
        } else {
          this.bankAccount = new BankAccount({}, this.businessId);
        }
        this.formController.setInitialValues({ ...this.bankAccount });
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => this.formLoading.emit(false)
    });
  }

  private sendData = (onSuccess: () => void) => {
    console.log
    let submittedData;
    this.formLoading.emit(true);
    this.postBankAccount({
      payload: this.postPayload,
      onSuccess: (response) => {
        submittedData = response;
        onSuccess();
      },
      onError: ({ error, code, severity }) => {
        submittedData = error;
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.bankAccount });
        this.formLoading.emit(false)
      }
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const bankAccountDefaultValue = this.formController.getInitialValues();

    return (
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Bank Account Info</legend>
            <form-control-tooltip helpText="The Direct Deposit Account is the business bank account where your funds will be deposited. The name of this account must match the registered business name exactly. We are not able to accept personal accounts unless your business is a registered sole proprietorship." />
          </div>
          <hr class="mt-2" />
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text
                name="bank_name"
                label="Bank Name"
                defaultValue={bankAccountDefaultValue.bank_name}
                errorText={this.errors.bank_name}
                inputHandler={this.inputHandler}
                disabled={this.formDisabled}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="nickname"
                label="Nickname"
                defaultValue={bankAccountDefaultValue.nickname}
                errorText={this.errors.nickname}
                inputHandler={this.inputHandler}
                disabled={this.formDisabled}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="account_owner_name"
                label="Account Owner Name"
                defaultValue={bankAccountDefaultValue.account_owner_name}
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
                defaultValue={bankAccountDefaultValue.account_type}
                errorText={this.errors.account_type}
                inputHandler={this.inputHandler}
                disabled={this.formDisabled}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="account_number"
                label="Account Number"
                defaultValue={bankAccountDefaultValue.account_number}
                maxLength={17}
                errorText={this.errors.account_number}
                inputHandler={this.inputHandler}
                keyDownHandler={numberOnlyHandler}
                disabled={this.formDisabled}
                helpText="Please copy the account number as shown on your statement/check. Do not include spaces or dashes."
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="routing_number"
                label="Routing Number"
                defaultValue={bankAccountDefaultValue.routing_number}
                maxLength={9}
                errorText={this.errors.routing_number}
                inputHandler={this.inputHandler}
                keyDownHandler={numberOnlyHandler}
                disabled={this.formDisabled}
                helpText="A valid routing number is nine digits. Please include any leading or trailing zeroes."
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
