import { Component, h, Method, State, Prop } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import ProductOrServiceSchema from "./schemas/product-or-service-schema";
import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep } from "./dispute-response-form-types";
import { heading5 } from "../../../styles/parts";

@Component({
  tag: 'justifi-product-or-service',
})
export class ProductOrService {
  @Prop() disputeResponse: any;
  @Prop() documentServerErrors: any;
  @State() form: FormController;
  @State() errors: any = {};
  @State() documentList = [];

  @Method()
  async validateAndSubmit(onSuccess: (formData: any, documentList: DisputeEvidenceDocument[], formStep: DisputeResponseFormStep) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData, this.documentList, DisputeResponseFormStep.productOrService));
  };

  componentWillLoad() {
    this.form = new FormController(ProductOrServiceSchema);
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
            <h2 class="h5" part={heading5}>Product & Service Details</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Product Description"
              name="product_description"
              defaultValue={this.disputeResponse?.product_description}
              inputHandler={this.inputHandler}
              errorText={this.errors.product_description}
            />
          </div>
          <div class="col-12">
            <form-control-date
              label="Service Date"
              name="service_date"
              defaultValue={this.disputeResponse?.service_date}
              inputHandler={this.inputHandler}
              errorText={this.errors.service_date}
            />
          </div>
          <div class="col-12">
            <form-control-file-v2
              label="Service Documentation"
              name="service_documentation"
              onChange={this.handleFileSelection}
              errorText={this.documentServerErrors?.service_documentation}
            />
          </div>
        </div>
      </div>
    );
  }
};
