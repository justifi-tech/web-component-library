import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../../form/form';

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
        <div class="row gy-3">
          <div class="col-12">
            <form-control-monetary
              name="business_revenue"
              label="Business Revenue"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_revenue}
              defaultValue={additionalQuestionsDefaultValue?.business_revenue}
            />
          </div>
          <div class="col-12">
            <form-control-monetary
              name="business_payment_volume"
              label="Business Payment Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_payment_volume}
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
              error={this.errors?.additional_questions?.business_dispute_volume}
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
                this.errors?.additional_questions?.business_receivable_volume
              }
              defaultValue={
                additionalQuestionsDefaultValue?.business_receivable_volume
              }
            />
          </div>
        </div>
      </Host>
    );
  }
}
