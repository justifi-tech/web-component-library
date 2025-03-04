import { Component, h, State, Method, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import ShippingDetailsSchema from "./schemas/shipping-details-schema";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";
import fileInputHandler from "./file-input-handler";

@Component({
  tag: 'justifi-shipping-details',
})
export class ShippingDetails {
  @Prop() disputeResponse: any;
  @Prop() documentErrors: any = {};

  @State() form: FormController;
  @State() errors: any = {};
  @State() documents: { shipping_documentation: DisputeEvidenceDocument[] } = { shipping_documentation: [] };
  @State() documentList: DisputeEvidenceDocument[] = [];

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    const documentList = Object.values(this.documents).flat();
    this.form.validateAndSubmit((formData) => onSuccess(formData, documentList, DisputeResponseFormStep.shippingDetails));
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

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5" part={heading5}>Shipping Details</h2>
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
              onChange={(e) => fileInputHandler(e as InputEvent, this.documents)}
              errorText={this.documentErrors?.shipping_documentation}
            />
          </div>
        </div>
      </div>
    );
  }
};
