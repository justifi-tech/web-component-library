import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import ElectronicEvidenceSchema from "./schemas/electronic-evidence-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";

@Component({
  tag: 'justifi-electronic-evidence',
})
export class ElectronicEvidence {
  @Prop() disputeResponse: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList = [];

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[]) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData, this.documentList));
  };

  componentWillLoad() {
    this.form = new FormController(ElectronicEvidenceSchema);
  }

  componentDidLoad() {
    this.form.errors.subscribe(errors => {
      this.errors = { ...errors };
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
            <h2 class="h5">Electronic Evidence</h2>
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
              name="access_activity_log"
              helpText="Any server or activity logs that provide evidence of the customer's access to or download of the purchased digital product. This information should encompass IP addresses, relevant timestamps, and any detailed records of activity."
              onChange={this.handleFileSelection}
              errorText={this.errors.access_activity_log}
            />
          </div>
        </div>
      </div>
    );
  }
};
