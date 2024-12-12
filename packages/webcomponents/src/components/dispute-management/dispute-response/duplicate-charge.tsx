import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import DuplicateChargeSchema from "./schemas/duplicate-charge-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";

@Component({
  tag: 'justifi-duplicate-charge',
})
export class DuplicateCharge {
  @Prop() disputeResponse: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList: DisputeEvidenceDocument[] = [];

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(DuplicateChargeSchema);
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
            <h2 class="h5">Duplicate Charge</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Original Payment ID"
              name="duplicate_charge_original_payment_id"
              defaultValue={this.disputeResponse?.duplicate_charge_original_payment_id}
              inputHandler={this.inputHandler}
              errorText={this.errors.duplicate_charge_original_payment_id}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Duplicate Charge Explanation"
              name="duplicate_charge_explanation"
              defaultValue={this.disputeResponse?.duplicate_charge_explanation}
              inputHandler={this.inputHandler}
              errorText={this.errors.duplicate_charge_explanation}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Duplicate Charge Documentation"
              name="duplicate_charge_documentation"
              onChange={this.handleFileSelection}
            />
          </div>
        </div>
      </div>
    );
  }
};
