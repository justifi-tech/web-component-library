import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import AdditionalStatementSchema from "./schemas/additional-statement-schema";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";
import fileInputHandler from "./file-input-handler";

@Component({
  tag: 'justifi-additional-statement',
})
export class AdditionalStatement {
  @Prop() disputeResponse: any;
  @Prop() documentErrors: any = {};

  @State() form: FormController;
  @State() errors: any = {};
  @State() acceptedTerms: boolean = false;
  @State() acceptedTermsErrorText: string;
  @State() documents: { uncategorized_file: DisputeEvidenceDocument[] } = { uncategorized_file: [] };

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    const documentList = Object.values(this.documents).flat();
    this.form.validateAndSubmit((formData) => onSuccess(formData, documentList, DisputeResponseFormStep.additionalStatement));
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

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5" part={heading5}>Additional Evidence</h2>
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
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.uncategorized_file}
            />
          </div>
        </div>
      </div>
    );
  }
};
