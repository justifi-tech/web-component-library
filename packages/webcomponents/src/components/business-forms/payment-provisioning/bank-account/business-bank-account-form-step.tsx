import { Component, Host, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors, BusinessFormStep, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { businessBankAccountSchema } from '../../schemas/business-bank-account-schema';
import { bankAccountTypeOptions } from '../../utils/business-form-options';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { IBusiness } from '../../../../components';
import { numberOnlyHandler } from '../../../form/utils';
import { BankAccount } from '../../../../api/BankAccount';

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
  tag: 'justifi-business-bank-account-form-step',
  styleUrl: 'business-bank-account-form-step.scss',
})
export class BusinessBankAccountFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() bankAccount: BankAccount;
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

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
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const formValues = this.formController.values.getValue();
      const payload = { ...formValues, business_id: this.businessId }
      const response = await this.api.post(this.bankAccountEndpoint, JSON.stringify(payload));
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.patchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: BusinessFormServerErrors.patchData });
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.bankAccount } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formDisabled ? onSuccess() :
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessBankAccountSchema(this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    this.fetchData();
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
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Bank Account Info</legend>
            <hr />
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
                  error={this.errors.account_type}
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
                />
              </div>
              
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
