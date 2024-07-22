import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { additionalQuestionsSchema } from '../../schemas/business-additional-questions-schema';
import { FormController } from '../../../form/form';
import { AdditionalQuestions, IAdditionalQuestions } from '../../../../api/Business';
import { BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { ComponentError } from '../../../../components';
import { CURRENCY_MASK } from '../../../../utils/form-input-masks';
import { businessServiceReceivedOptions, recurringPaymentsOptions, seasonalBusinessOptions } from '../../utils/business-form-options';

@Component({
  tag: 'justifi-additional-questions-form-step-core',
})
export class AdditionalQuestionsFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() additional_questions: IAdditionalQuestions = {};

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;
  
  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  get patchPayload() {
    let formValues = this.formController.values.getValue();
    return JSON.stringify({ additional_questions: formValues });
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(additionalQuestionsSchema(this.allowOptionalFields));
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
        this.additional_questions = new AdditionalQuestions(response.data.additional_questions || {});
        this.formController.setInitialValues({ ...this.additional_questions });
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
    let submittedData;
    this.formLoading.emit(true);
    this.patchBusiness({
      payload: this.patchPayload,
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
        this.submitted.emit({ data: { submittedData } });
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
    const additionalQuestionsDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts='label,input,input-invalid'>
        <form>
          <fieldset>
            <legend>Additional Questions</legend>
            <hr />
            <div class='row gy-3'>
              <div class='col-12 col-md-6'>
                <form-control-monetary
                  name='business_revenue'
                  label='What is the business’ estimated annual revenue from its primary business activies?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_revenue}
                  defaultValue={additionalQuestionsDefaultValue?.business_revenue}
                  maskOptions={CURRENCY_MASK.WHOLE}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-monetary
                  name='business_payment_volume'
                  label='What is the business’ annual credit card & ACH volume anticipated to process?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_payment_volume}
                  defaultValue={additionalQuestionsDefaultValue?.business_payment_volume}
                  maskOptions={CURRENCY_MASK.WHOLE}
                />
              </div>
              <div class='col-12'>
                <form-control-select
                  name='business_when_service_received'
                  label='On average, how long after paying will your customers typically receive their goods or services?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_when_service_received}
                  options={businessServiceReceivedOptions}
                  defaultValue={additionalQuestionsDefaultValue?.business_when_service_received}
                />
              </div>
              <div class='col-12'>
                <form-control-select
                  name='business_recurring_payments'
                  label='Does your business offer recurring payments?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_recurring_payments}
                  options={recurringPaymentsOptions}
                  defaultValue={additionalQuestionsDefaultValue?.business_recurring_payments}
                />
              </div>
              <div class='col-12'>
                <form-control-text
                  name='business_recurring_payments_percentage'
                  label='What percent of revenue is generated from each recurring payment type offered?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_recurring_payments_percentage}
                  defaultValue={additionalQuestionsDefaultValue?.business_recurring_payments_percentage}
                />
              </div>
              <div class='col-12'>
                <form-control-select
                  name='business_seasonal'
                  label='Is this business seasonal?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_seasonal}
                  options={seasonalBusinessOptions}
                  defaultValue={additionalQuestionsDefaultValue?.business_seasonal}
                />
              </div>
              <div class='col-12'>
                <form-control-text
                  name='business_other_payment_details'
                  label='Is there anything else you would like us to know about how your customers pay the business?'
                  inputHandler={this.inputHandler}
                  errorText={this.errors?.business_other_payment_details}
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
