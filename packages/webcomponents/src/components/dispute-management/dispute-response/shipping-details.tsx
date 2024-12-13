import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import ShippingDetailsSchema from "./schemas/shipping-details-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";

@Component({
  tag: 'justifi-shipping-details',
})
export class ShippingDetails {
  @Prop() disputeResponse: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList: DisputeEvidenceDocument[] = [];

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[]) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData, this.documentList));
  };

  componentWillLoad() {
    this.form = new FormController(ShippingDetailsSchema);
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
            <h2 class="h5">Shipping Details</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Shipping Carrier Name"
              name="shipping_carrier"
              defaultValue={this.disputeResponse?.shipping_carrier}
              inputHandler={this.inputHandler}
              errorText={this.errors.shipping_carrier}
            />
          </div>
          <div class="col-12">
            <form-control-text
              label="Tracking Number"
              name="shipping_tracking_number"
              defaultValue={this.disputeResponse?.shipping_tracking_number}
              inputHandler={this.inputHandler}
              errorText={this.errors.shipping_tracking_number}
            />
          </div>
          <div class="col-12">
            <form-control-date
              label="Date Shipped"
              name="shipping_date"
              defaultValue={this.disputeResponse?.shipping_date}
              inputHandler={this.inputHandler}
              errorText={this.errors.shipping_date}
            />
          </div>
          <div class="col-12">
            {/* TODO: Make this a text area later */}
            <form-control-textarea
              label="Shipping Address"
              name="shipping_address"
              defaultValue={this.disputeResponse?.shipping_address}
              inputHandler={this.inputHandler}
              errorText={this.errors.shipping_address}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Shipping Documentation"
              name="shipping_documentation"
              onChange={this.handleFileSelection}
            />
          </div>
        </div>
      </div>
    );
  }
};
