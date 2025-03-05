import { Component, h, Method, Prop, State } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import CustomerDetailsSchema from "./schemas/customer-details-schema";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";
import fileInputHandler from "./file-input-handler";

@Component({
  tag: 'justifi-customer-details',
})
export class CustomerDetails {
  @Prop() disputeResponse: any;
  @Prop() documentErrors: any = {};

  @State() form: FormController;
  @State() errors: any = {};
  @State() documents: {
    customer_signature: DisputeEvidenceDocument[],
    customer_communication: DisputeEvidenceDocument[]
  } = { customer_signature: [], customer_communication: [] };

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    const documentList = Object.values(this.documents).flat();
    this.form.validateAndSubmit((formData) => onSuccess(formData, documentList, DisputeResponseFormStep.customerDetails));
  };

  componentWillLoad() {
    this.form = new FormController(CustomerDetailsSchema);
  }

  componentDidLoad() {
    this.form.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private inputHandler = (name: string, value: string) => {
    this.form.setValues({
      ...this.form.values.getValue(),
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5" part={heading5}>Customer Details</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Full Name"
              name="customer_name"
              defaultValue={this.disputeResponse?.customer_name}
              inputHandler={this.inputHandler}
              errorText={this.errors.customer_name}
            />
          </div>
          <div class="col-12">
            <form-control-text
              label="Email"
              name="customer_email_address"
              defaultValue={this.disputeResponse?.customer_email_address}
              inputHandler={this.inputHandler}
              errorText={this.errors.customer_email_address}
            />
          </div>
          <div class="col-12">
            {/* TODO: Make this a text area later */}
            <form-control-textarea
              label="Billing Address"
              name="customer_billing_address"
              defaultValue={this.disputeResponse?.customer_billing_address}
              inputHandler={this.inputHandler}
              errorText={this.errors.customer_billing_address}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Customer Signature"
              name="customer_signature"
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.customer_signature}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Customer Communication"
              name="customer_communication"
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.customer_communication}
            />
          </div>
        </div>
      </div>
    );
  }
};
