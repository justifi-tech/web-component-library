import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import CancellationPolicySchema from "./schemas/cancellation-policy-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";

@Component({
  tag: 'justifi-cancellation-policy',
})
export class CancellationPolicy {
  @Prop() disputeResponse: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList: DisputeEvidenceDocument[] = [];

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData, this.documentList, DisputeResponseFormStep.cancellationPolicy));
  };

  componentWillLoad() {
    this.form = new FormController(CancellationPolicySchema);
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

  private handleFileSelection = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as DisputeEvidenceDocumentType;
    const files = target.files as unknown as File[];
    for (const file of files) {
      this.documentList.push(new DisputeEvidenceDocument(file, name));
    }
  }

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5" part={heading5}>Cancellation Policy</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Cancellation Policy Disclosure"
              name="cancellation_policy_disclosure"
              defaultValue={this.disputeResponse?.cancellation_policy_disclosure}
              inputHandler={this.inputHandler}
              errorText={this.errors.cancellation_policy_disclosure}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Cancellation Rebuttal"
              name="cancellation_rebuttal"
              defaultValue={this.disputeResponse?.cancellation_rebuttal}
              inputHandler={this.inputHandler}
              errorText={this.errors.cancellation_rebuttal}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Upload Cancellation Policy"
              name="cancellation_policy_file"
              onChange={this.handleFileSelection}
            />
          </div>
        </div>
      </div>
    );
  }
};
