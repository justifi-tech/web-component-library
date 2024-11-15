import { Component, h, Method, State } from "@stencil/core";
import { FormController } from "../../form/form";
import { FileSelectEvent } from "../../form/form-control-file";
import { DisputeResponseDocument, DisputeResponseDocumentType } from "../../../api/DisputeResponseDocument";
import ProductOrServiceSchema from "./schemas/product-or-service-schema";

@Component({
  tag: 'justifi-product-or-service',
})
export class ProductOrService {
  @State() form: FormController;
  @State() errors: any = {};
  @State() values: any = {};
  @State() documentData: { [key: string]: DisputeResponseDocument[] } = {};

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(ProductOrServiceSchema);
  }

  componentDidLoad() {
    this.form.values.subscribe(values =>
      this.values = { ...values }
    );
    this.form.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private sendData = (onSuccess: () => void) => {
    onSuccess();
  }

  private storeFiles = (e: CustomEvent<FileSelectEvent>) => {
    const fileList = Array.from(e.detail.fileList) as File[];
    const docType = e.detail.document_type;
    const documentList = fileList.map(file => new DisputeResponseDocument({
      file,
      document_type: docType as DisputeResponseDocumentType
    }));
    this.documentData[docType] = documentList;
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
            <h2 class="h5">Product & Service Details</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Product Description"
              name="product_description"
              inputHandler={this.inputHandler}
              errorText={this.errors.product_description}
            />
          </div>
          <div class="col-12">
            <form-control-text
              label="Service Date"
              name="service_date"
              inputHandler={this.inputHandler}
              errorText={this.errors.service_date}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Service Documentation"
              name="service_documentation"
              onFileSelected={this.storeFiles}
              errorText={this.errors.service_documentation}
            />
          </div>
        </div>
      </div>
    );
  }
};
