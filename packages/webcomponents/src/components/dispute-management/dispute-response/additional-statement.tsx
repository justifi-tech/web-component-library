import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import AdditionalStatementSchema from "./schemas/additional-statement-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";

@Component({
  tag: 'justifi-additional-statement',
})
export class AdditionalStatement {
  @Prop() disputeResponse: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList: DisputeEvidenceDocument[] = [];

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[]) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData, this.documentList));
  };

  componentWillLoad() {
    this.form = new FormController(AdditionalStatementSchema);
  }

  componentDidLoad() {
    this.form.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private inputHandler = (name: string, value: string | boolean) => {
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
            <h2 class="h5">Additional Evidence</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Is there anything else you would like to say about this dispute?"
              name="additional_statement"
              defaultValue={this.disputeResponse?.additional_statement}
              inputHandler={this.inputHandler}
              errorText={this.errors.additional_statement}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Additional files"
              name="uncategorized_file"
              multiple={true}
              helpText="Upload any additional pieces of evidence that have not already been provided."
              onChange={this.handleFileSelection}
            />
          </div>
          <div class="col-12">
            <form-control-checkbox
              name="forfeit"
              label="I understand that this information can only be submitted once and have provided as much evidence as possible to support my claim."
              inputHandler={(name, forfeit) => {
                const acknowledgement = !forfeit;
                this.inputHandler(name, acknowledgement)
              }}
              errorText={this.errors.forfeit}
            />
          </div>
        </div>
      </div>
    );
  }
};
