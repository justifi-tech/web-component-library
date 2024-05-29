import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { AdditionalQuestions, IAdditionalQuestions, IBusiness } from '../../../../api/Business';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { additionalQuestionsSchema } from '../../schemas/business-additional-questions-schema';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { CURRENCY_MASK } from '../../../../utils/form-input-masks';
import { businessServiceReceivedOptions, recurringPaymentsOptions, seasonalBusinessOptions } from '../../utils/business-form-options';

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
  @Prop() allowOptionalFields?: boolean;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() additional_questions: IAdditionalQuestions = {};
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.additional_questions = new AdditionalQuestions(response.data.additional_questions || {});
      this.formController.setInitialValues({ ...this.additional_questions });
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = this.formController.values.getValue();
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify({ additional_questions: payload }));
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
    this.submitted.emit({ data: response, metadata: { completedStep: 'additionalQuestions' } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(additionalQuestionsSchema(this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
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

  inputHandler = (name: string, value: string) => {
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
            <div class="row gy-3">
              <div class="col-12 col-md-6">
                <form-control-monetary
                  name="business_revenue"
                  label="What is the business' estimated annual revenue from its primary business activies?"
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_revenue}
                  defaultValue={additionalQuestionsDefaultValue?.business_revenue}
                  maskOptions={CURRENCY_MASK.WHOLE}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-monetary
                  name="business_payment_volume"
                  label="What is the business’ annual credit card & ACH volume anticipated to process?"
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_payment_volume}
                  defaultValue={additionalQuestionsDefaultValue?.business_payment_volume}
                  maskOptions={CURRENCY_MASK.WHOLE}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name='business_when_service_received'
                  label='On average, how long after paying will your customers typically receive their goods or services?'
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_when_service_received}
                  options={businessServiceReceivedOptions}
                  defaultValue={additionalQuestionsDefaultValue?.business_when_service_received}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name='business_recurring_payments'
                  label='Does your business offer recurring payments?'
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_recurring_payments}
                  options={recurringPaymentsOptions}
                  defaultValue={additionalQuestionsDefaultValue?.business_recurring_payments}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name='business_recurring_payments_percentage'
                  label='What percent of revenue is generated from each recurring payment type offered?'
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_recurring_payments_percentage}
                  defaultValue={additionalQuestionsDefaultValue?.business_recurring_payments_percentage}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name='business_seasonal'
                  label='Is this business seasonal?'
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_seasonal}
                  options={seasonalBusinessOptions}
                  defaultValue={additionalQuestionsDefaultValue?.business_seasonal}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name='business_other_payment_details'
                  label='Is there anything else you would like us to know about how your customers pay the business?'
                  inputHandler={this.inputHandler}
                  error={this.errors?.business_other_payment_details}
                  defaultValue={additionalQuestionsDefaultValue?.business_other_payment_details}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
