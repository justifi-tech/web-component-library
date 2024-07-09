import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../../form/form';
import { 
  businessServiceReceivedOptions, 
  recurringPaymentsOptions, 
  seasonalBusinessOptions 
} from '../../utils/business-form-options';
import { CURRENCY_MASK } from '../../../../utils/form-input-masks';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-additional-questions',
})
export class AdditionalQuestions {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() additional_questions: any = {};

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    this.formController.values.subscribe(
      values =>
        (this.additional_questions = { ...values.additional_questions }),
    );
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      additional_questions: {
        ...this.formController.values.getValue().additional_questions,
        [name]: value,
      },
    });
  }

  render() {
    const additionalQuestionsDefaultValue =
      this.formController.getInitialValues().additional_questions;

    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          <legend>Additional Questions</legend>
          <hr />
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <form-control-monetary
                name="business_revenue"
                label="What is the business' estimated annual revenue from its primary business activies?"
                inputHandler={this.inputHandler}
                error={this.errors?.additional_questions?.business_revenue}
                defaultValue={additionalQuestionsDefaultValue?.business_revenue}
                maskOptions={CURRENCY_MASK.WHOLE}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-monetary
                name="business_payment_volume"
                label="What is the business’ annual credit card & ACH volume anticipated to process?"
                inputHandler={this.inputHandler}
                error={this.errors?.additional_questions?.business_payment_volume}
                defaultValue={additionalQuestionsDefaultValue?.business_payment_volume}
                maskOptions={CURRENCY_MASK.WHOLE}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name='business_when_service_received'
                label='On average, how long after paying will your customers typically receive their goods or services?'
                inputHandler={this.inputHandler}
                error={this.errors?.additional_questions?.business_when_service_received}
                options={businessServiceReceivedOptions}
                defaultValue={additionalQuestionsDefaultValue?.business_when_service_received}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name='business_recurring_payments'
                label='Does your business offer recurring payments?'
                inputHandler={this.inputHandler}
                error={this.errors?.additional_questions?.business_recurring_payments}
                options={recurringPaymentsOptions}
                defaultValue={additionalQuestionsDefaultValue?.business_recurring_payments}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name='business_recurring_payments_percentage'
                label='What percent of revenue is generated from each recurring payment type offered?'
                inputHandler={this.inputHandler}
                errorText={this.errors?.additional_questions?.business_recurring_payments_percentage}
                defaultValue={additionalQuestionsDefaultValue?.business_recurring_payments_percentage}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name='business_seasonal'
                label='Is this business seasonal?'
                inputHandler={this.inputHandler}
                error={this.errors?.additional_questions?.business_seasonal}
                options={seasonalBusinessOptions}
                defaultValue={additionalQuestionsDefaultValue?.business_seasonal}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name='business_other_payment_details'
                label='Is there anything else you would like us to know about how your customers pay the business?'
                inputHandler={this.inputHandler}
                errorText={this.errors?.additional_questions?.business_other_payment_details}
                defaultValue={additionalQuestionsDefaultValue?.business_other_payment_details}
              />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }
}
