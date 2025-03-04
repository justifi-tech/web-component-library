import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import ElectronicEvidenceSchema from "./schemas/electronic-evidence-schema";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";
import fileInputHandler from "./file-input-handler";

@Component({
  tag: 'justifi-electronic-evidence',
})
export class ElectronicEvidence {
  @Prop() disputeResponse: any;
  @Prop() documentErrors: any = {};

  @State() form: FormController;
  @State() errors: any = {};
  @State() documents: { activity_log: DisputeEvidenceDocument[] } = { activity_log: [] };

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    const documentList = Object.values(this.documents).flat();
    this.form.validateAndSubmit((formData) => onSuccess(formData, documentList, DisputeResponseFormStep.electronicEvidence));
  };

  componentWillLoad() {
    this.form = new FormController(ElectronicEvidenceSchema);
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
            <h2 class="h5" part={heading5}>Electronic Evidence</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Purchase IP Address"
              name="customer_purchase_ip_address"
              helpText="The IP address used by the customer during the purchase."
              defaultValue={this.disputeResponse?.customer_purchase_ip_address}
              inputHandler={this.inputHandler}
              errorText={this.errors.customer_purchase_ip_address}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Activity Logs"
              name="activity_log"
              helpText="Any server or activity logs that provide evidence of the customer's access to or download of the purchased digital product. This information should encompass IP addresses, relevant timestamps, and any detailed records of activity."
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.activity_log}
            />
          </div>
        </div>
      </div>
    );
  }
};
