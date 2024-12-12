import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import CancellationPolicySchema from "./schemas/cancellation-policy-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";

@Component({
  tag: 'justifi-cancellation-policy',
})
export class CancellationPolicy {
  @Prop() disputeResponse: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList: DisputeEvidenceDocument[] = [];

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(CancellationPolicySchema);
  }

  componentDidLoad() {
    this.form.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private sendData = (onSuccess: () => void) => {
    onSuccess();
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
            <h2 class="h5">Cancellation Policy</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Cancellation Policy Disclosure"
              name="cancellation_policy_disclosure"
              defaultValue={this.disputeResponse?.cancellation_policy_disclosure}
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Cancellation Rebuttal"
              name="cancellation_rebuttal"
              defaultValue={this.disputeResponse?.cancellation_rebuttal}
              inputHandler={this.inputHandler}
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
