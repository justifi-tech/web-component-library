import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { FormController } from '../../form/form';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-additional-questions',
  shadow: false,
})
export class AdditionalQuestions {
  @Prop() formController: FormController;
  @State() errors: any = {};
  @State() defaultValues: any = {};
  @State() additionalQuestions: any = {};

  @Watch('additionalQuestions')
  handleAdditionalQuestionsChange(newValues: any) {
    this.formController.setValues({ additionalQuestions: newValues });
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => (this.errors = { ...errors }));
    this.formController.defaultValues.subscribe(defaultValues => (this.defaultValues = { ...defaultValues }));
  }

  inputHandler(name: string, value: string) {
    this.additionalQuestions = { ...this.additionalQuestions, [name]: value };
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gy-3">
          <div class="col-12">
            <form-control-text
              name="business_revenue"
              label="Business Revenue"
              defaultValue={this.defaultValues.business_revenue}
              error={this.errors?.additionalQuestions?.business_revenue}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_purchase_order_volume"
              label="Business Purchase Order Volume"
              defaultValue={this.defaultValues.business_purchase_order_volume}
              error={this.errors?.additionalQuestions?.business_purchase_order_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_invoice_volume"
              label="Business Invoice Volume"
              defaultValue={this.defaultValues.business_invoice_volume}
              error={this.errors?.additionalQuestions?.business_invoice_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_fund_use_intent"
              label="Business Fund Use Intent"
              defaultValue={this.defaultValues.business_fund_use_intent}
              error={this.errors?.additionalQuestions?.business_fund_use_intent}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="equipment_invoice"
              label="Equipment Invoice"
              defaultValue={this.defaultValues.equipment_invoice}
              error={this.errors?.additionalQuestions?.equipment_invoice}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_invoice_number"
              label="Business Invoice Number"
              defaultValue={this.defaultValues.business_invoice_number}
              error={this.errors?.additionalQuestions?.business_invoice_number}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_invoice_amount"
              label="Business Invoice Amount"
              defaultValue={this.defaultValues.business_invoice_amount}
              error={this.errors?.additionalQuestions?.business_invoice_amount}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_purchase_order_number"
              label="Business Purchase Order Number"
              defaultValue={this.defaultValues.business_purchase_order_number}
              error={this.errors?.additionalQuestions?.business_purchase_order_number}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="industry_code"
              label="Industry Code"
              defaultValue={this.defaultValues.industry_code}
              error={this.errors?.additionalQuestions?.industry_code}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="duns_number"
              label="DUNS Number"
              defaultValue={this.defaultValues.duns_number}
              error={this.errors?.additionalQuestions?.duns_number}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_payment_volume"
              label="Business Payment Volume"
              defaultValue={this.defaultValues.business_payment_volume}
              error={this.errors?.additionalQuestions?.business_payment_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_payment_decline_volume"
              label="Business Payment Decline Volume"
              defaultValue={this.defaultValues.business_payment_decline_volume}
              error={this.errors?.additionalQuestions?.business_payment_decline_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_refund_volume"
              label="Business Refund Volume"
              defaultValue={this.defaultValues.business_refund_volume}
              error={this.errors?.additionalQuestions?.business_refund_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_dispute_volume"
              label="Business Dispute Volume"
              defaultValue={this.defaultValues.business_dispute_volume}
              error={this.errors?.additionalQuestions?.business_dispute_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_receivable_volume"
              label="Business Receivable Volume"
              defaultValue={this.defaultValues.business_receivable_volume}
              error={this.errors?.additionalQuestions?.business_receivable_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_future_scheduled_payment_volume"
              label="Business Future Scheduled Payment Volume"
              defaultValue={this.defaultValues.business_future_scheduled_payment_volume}
              error={this.errors?.additionalQuestions?.business_future_scheduled_payment_volume}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="business_dispute_win_rate"
              label="Business Dispute Win Rate"
              defaultValue={this.defaultValues.business_dispute_win_rate}
              error={this.errors?.additionalQuestions?.business_dispute_win_rate}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              name="length_of_business_relationship"
              label="Length of Business Relationship"
              defaultValue={this.defaultValues.length_of_business_relationship}
              error={this.errors?.additionalQuestions?.length_of_business_relationship}
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </Host>
    );
  }
}
