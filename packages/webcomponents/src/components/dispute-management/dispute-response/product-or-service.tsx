import { Component, h, Method, Prop, State } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import ProductOrServiceSchema from "./schemas/product-or-service-schema";
import { FileSelectEvent } from "../../../components";

@Component({
  tag: 'justifi-product-or-service',
})
export class ProductOrService {
  @Prop() handleFileSelection: (event: CustomEvent<FileSelectEvent>) => void;
  @State() form: FormController;
  @State() errors: any = {};
  @State() values: any = {};

  @Method()
  async validateAndSubmit(onSuccess: (formData: any) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData));
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
              inputHandler={() => { return; }}
              onFileSelected={this.handleFileSelection}
              errorText={this.errors.service_documentation}
            />
          </div>
        </div>
      </div>
    );
  }
};
