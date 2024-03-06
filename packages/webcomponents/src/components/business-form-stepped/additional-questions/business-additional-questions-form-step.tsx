import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../form/form';
import { BusinessFormServerErrors, IBusiness } from '../../../api/Business';
import { Api, IApiResponse } from '../../../api';
import { config } from '../../../../config';
import { additionQuestionsSchema } from '../../business-form/business-form-schema';
import { FormAlert } from '../../form/utils';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-additional-questions-form-step',
})
export class AdditionalQuestionsFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() additional_questions: any = {};
  @State() serverError: any;
  @State() errorMessage: BusinessFormServerErrors;
  @Event({ bubbles: true }) submitted: EventEmitter<{ data?: any }>;
  @Event({ bubbles: true }) formLoading: EventEmitter<boolean>;

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  
  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private handleServerErrors(error: any, message: BusinessFormServerErrors) {
    this.serverError = error;
    this.errorMessage = message;
  }

  private async fetchData() {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.additional_questions = response.data.additional_questions;
      this.formController.setInitialValues(this.additional_questions);
    } catch (error) {
      this.handleServerErrors(error, BusinessFormServerErrors.fetchData);
    } finally {
      this.formLoading.emit(false);
    }
  }

  private async sendData(onSuccess?: () => void) {
    this.formLoading.emit(true);
    try {
      const payload = this.formController.values.getValue();
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify({ additional_questions: payload}));
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.handleServerErrors(error, BusinessFormServerErrors.patchData);
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.handleServerErrors(response.error, BusinessFormServerErrors.patchData);
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response });
  }

  @Method()
  async validateAndSubmit(onSuccess: () => Promise<void>) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(additionQuestionsSchema);
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.additional_questions = { ...values }
    );
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const additionalQuestionsDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Additional Questions</legend>
            <hr />
            {this.serverError && FormAlert(this.errorMessage)}
            <div class="row gy-3">
              <div class="col-12">
                <form-control-monetary
                  name="business_revenue"
                  label="Business Revenue"
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_revenue}
                  defaultValue={additionalQuestionsDefaultValue?.business_revenue}
                />
              </div>
              <div class="col-12">
                <form-control-monetary
                  name="business_payment_volume"
                  label="Business Payment Volume"
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_payment_volume}
                  defaultValue={
                    additionalQuestionsDefaultValue?.business_payment_volume
                  }
                />
              </div>
              <div class="col-12">
                <form-control-monetary
                  name="business_dispute_volume"
                  label="Business Dispute Volume"
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_dispute_volume}
                  defaultValue={
                    additionalQuestionsDefaultValue?.business_dispute_volume
                  }
                />
              </div>
              <div class="col-12">
                <form-control-monetary
                  name="business_receivable_volume"
                  label="Business Receivable Volume"
                  inputHandler={this.inputHandler}
                  error={
                    this.errors?.business_receivable_volume
                  }
                  defaultValue={
                    additionalQuestionsDefaultValue?.business_receivable_volume
                  }
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
