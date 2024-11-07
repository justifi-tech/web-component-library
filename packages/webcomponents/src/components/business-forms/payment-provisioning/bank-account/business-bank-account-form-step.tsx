import { Component, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormStep, BusinessFormStepCompletedEvent, BusinessFormStepV2, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { businessBankAccountSchema } from '../../schemas/business-bank-account-schema';
import { bankAccountTypeOptions } from '../../utils/business-form-options';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { IBusiness } from '../../../../components';
import { numberOnlyHandler } from '../../../form/utils';
import { BankAccount } from '../../../../api/BankAccount';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';

/**
 *
 * The difference between this component and business-generic-info-details
 * is that this component is meant to be a form and send data
 * and the other one  is meant to be just read only.
 *
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-bank-account-form-step'
})
export class BusinessBankAccountFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() bankAccount: BankAccount;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ eventName: 'form-step-completed', bubbles: true }) stepCompleted: EventEmitter<BusinessFormStepCompletedEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get bankAccountEndpoint() {
    return `entities/bank_accounts`
  }

  get formDisabled() {
    return !!this.bankAccount?.id;
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      if (response.data.bank_accounts.length > 0) {
        this.bankAccount = { ...new BankAccount(response.data.bank_accounts[0]) };
      } else {
        this.bankAccount = { ...new BankAccount({}) };
      }
      this.formController.setInitialValues({ ...this.bankAccount });
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.FETCH_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const formValues = this.formController.values.getValue();
      const payload = { ...formValues, business_id: this.businessId }
      const response = await this.api.post(this.bankAccountEndpoint, payload);
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: response.error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: response.error,
      })
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.bankAccount } });
    this.stepCompleted.emit({ data: response, formStep: BusinessFormStepV2.bankAccount });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    if (this.formDisabled) {
      this.stepCompleted.emit({ data: null, formStep: BusinessFormStepV2.bankAccount, metadata: 'no data submitted' });
      onSuccess();
    } else {
      this.formController.validateAndSubmit(() => this.sendData(onSuccess));
    };
  };

  componentWillLoad() {
    this.formController = new FormController(businessBankAccountSchema(this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    if (this.businessId && this.authToken) {
      this.fetchData();
    }
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.bankAccount = { ...values }
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
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
            <legend class="mb-0">Bank Account Info</legend>
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