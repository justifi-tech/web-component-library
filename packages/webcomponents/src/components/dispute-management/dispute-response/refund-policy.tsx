import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import RefundPolicySchema from "./schemas/refund-policy-schema";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";
import fileInputHandler from "./file-input-handler";

@Component({
  tag: 'justifi-refund-policy',
})
export class RefundPolicy {
  @Prop() disputeResponse: any;
  @Prop() documentErrors: any = {};

  @State() form: FormController;
  @State() errors: any = {};
  @State() documents: {
    refund_policy: DisputeEvidenceDocument[],
    receipt: DisputeEvidenceDocument[],
  } = { refund_policy: [], receipt: [] };

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    const documentList = Object.values(this.documents).flat();
    this.form.validateAndSubmit((formData) => onSuccess(formData, documentList, DisputeResponseFormStep.refundPolicy));
  };

  componentWillLoad() {
    this.form = new FormController(RefundPolicySchema);
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
            <h2 class="h5" part={heading5}>Refund Policy and Receipt</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Refund Policy Disclosure"
              name="refund_policy_disclosure"
              defaultValue={this.disputeResponse?.refund_policy_disclosure}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Refund Refusal Explanation"
              name="refund_refusal_explanation"
              defaultValue={this.disputeResponse?.refund_refusal_explanation}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Upload Refund Policy"
              name="refund_policy"
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.refund_policy}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Upload Receipt"
              name="receipt"
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.receipt}
            />
          </div>
        </div>
      </div>
    );
  }
};
