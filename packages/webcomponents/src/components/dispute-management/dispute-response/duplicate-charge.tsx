import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import DuplicateChargeSchema from "./schemas/duplicate-charge-schema";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";
import fileInputHandler from "./file-input-handler";

@Component({
  tag: 'justifi-duplicate-charge',
})
export class DuplicateCharge {
  @Prop() disputeResponse: any;
  @Prop() documentErrors: any = {};

  @State() form: FormController;
  @State() errors: any = {};
  @State() documents: { duplicate_charge_documentation: DisputeEvidenceDocument[] } = { duplicate_charge_documentation: [] };

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    const documentList = Object.values(this.documents).flat();
    this.form.validateAndSubmit((formData) => onSuccess(formData, documentList, DisputeResponseFormStep.duplicateCharge));
  };

  componentWillLoad() {
    this.form = new FormController(DuplicateChargeSchema);
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
            <h2 class="h5" part={heading5}>Duplicate Charge</h2>
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
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.duplicate_charge_documentation}
            />
          </div>
        </div>
      </div>
    );
  }
};
