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
    this.formController.errors.subscribe(errors => (this.errors = { ...errors }));
    this.formController.values.subscribe(values => (this.additional_questions = { ...values }));
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
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gy-3">
          <div class="col-12">
            <form-control-text
              name="business_revenue"
              label="Business Revenue"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_revenue}
              defaultValue={this.additional_questions?.business_revenue}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_purchase_order_volume"
              label="Business Purchase Order Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_purchase_order_volume}
              defaultValue={this.additional_questions?.business_purchase_order_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_invoice_volume"
              label="Business Invoice Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_invoice_volume}
              defaultValue={this.additional_questions?.business_invoice_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_fund_use_intent"
              label="Business Fund Use Intent"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_fund_use_intent}
              defaultValue={this.additional_questions?.business_fund_use_intent}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="equipment_invoice"
              label="Equipment Invoice"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.equipment_invoice}
              defaultValue={this.additional_questions?.equipment_invoice}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_invoice_number"
              label="Business Invoice Number"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_invoice_number}
              defaultValue={this.additional_questions?.business_invoice_number}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_invoice_amount"
              label="Business Invoice Amount"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_invoice_amount}
              defaultValue={this.additional_questions?.business_invoice_amount}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_purchase_order_number"
              label="Business Purchase Order Number"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_purchase_order_number}
              defaultValue={this.additional_questions?.business_purchase_order_number}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="industry_code"
              label="Industry Code"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.industry_code}
              defaultValue={this.additional_questions?.industry_code}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="duns_number"
              label="DUNS Number"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.duns_number}
              defaultValue={this.additional_questions?.duns_number}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_payment_volume"
              label="Business Payment Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_payment_volume}
              defaultValue={this.additional_questions?.business_payment_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_payment_decline_volume"
              label="Business Payment Decline Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_payment_decline_volume}
              defaultValue={this.additional_questions?.business_payment_decline_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_refund_volume"
              label="Business Refund Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_refund_volume}
              defaultValue={this.additional_questions?.business_refund_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_dispute_volume"
              label="Business Dispute Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_dispute_volume}
              defaultValue={this.additional_questions?.business_dispute_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_receivable_volume"
              label="Business Receivable Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_receivable_volume}
              defaultValue={this.additional_questions?.business_receivable_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_future_scheduled_payment_volume"
              label="Business Future Scheduled Payment Volume"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_future_scheduled_payment_volume}
              defaultValue={this.additional_questions?.business_future_scheduled_payment_volume}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_dispute_win_rate"
              label="Business Dispute Win Rate"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.business_dispute_win_rate}
              defaultValue={this.additional_questions?.business_dispute_win_rate}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="length_of_business_relationship"
              label="Length of Business Relationship"
              inputHandler={this.inputHandler}
              error={this.errors?.additional_questions?.length_of_business_relationship}
              defaultValue={this.additional_questions?.length_of_business_relationship}
            />
          </div>
        </div>
      </Host>
    );
  }
}
