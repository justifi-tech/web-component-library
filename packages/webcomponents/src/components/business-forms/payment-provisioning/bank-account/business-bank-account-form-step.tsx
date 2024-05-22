import { Component, Host, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { businessBankAccountSchema } from '../../schemas/business-bank-account-schema';
import { bankAccountTypeOptions } from '../../utils/business-form-options';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { IBusiness } from '../../../../components';
import { numberOnlyHandler } from '../../../form/utils';

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
  @State() bankInfo: any = {};
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

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.bankInfo = response.data.bank_accounts[0] || {};
      this.formController.setInitialValues({ ...this.bankInfo });
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  // private sendData = async (onSuccess?: () => void) => {
  //   this.formLoading.emit(true);
  //   try {
  //     const payload = parseCoreInfo(flattenNestedObject(this.formController.values.getValue()));
  //     const response = await this.api.patch(this.businessEndpoint, JSON.stringify(payload));
  //     this.handleResponse(response, onSuccess);
  //   } catch (error) {
  //     this.serverError.emit({ data: error, message: BusinessFormServerErrors.patchData });
  //   } finally {
  //     this.formLoading.emit(false);
  //   }
  // }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: BusinessFormServerErrors.patchData });
    } else {
      onSuccess();
    }
    // this.submitted.emit({ data: response, metadata: { completedStep: 'bankInfo' } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => console.log(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessBankAccountSchema(this.allowOptionalFields));
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.bankInfo = { ...values }
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
    const bankInfoDefaultValue = this.formController.getInitialValues();

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
                  defaultValue={bankInfoDefaultValue.bank_name}
                  error={this.errors.bank_name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="nickname"
                  label="Nickname"
                  defaultValue={bankInfoDefaultValue.nickname}
                  error={this.errors.nickname}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="account_owner_name"
                  label="Account Owner Name"
                  defaultValue={bankInfoDefaultValue.account_owner_name}
                  error={this.errors.account_owner_name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name="account_type"
                  label="Account Type"
                  options={bankAccountTypeOptions}
                  defaultValue={bankInfoDefaultValue.account_type}
                  error={this.errors.account_type}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="account_number"
                  label="Account Number"
                  defaultValue={bankInfoDefaultValue.account_number}
                  maxLength={17}
                  error={this.errors.account_number}
                  inputHandler={this.inputHandler}
                  keyDownHandler={numberOnlyHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="routing_number"
                  label="Routing Number"
                  defaultValue={bankInfoDefaultValue.routing_number}
                  maxLength={9}
                  error={this.errors.routing_number}
                  inputHandler={this.inputHandler}
                  keyDownHandler={numberOnlyHandler}
                />
              </div>
              
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
