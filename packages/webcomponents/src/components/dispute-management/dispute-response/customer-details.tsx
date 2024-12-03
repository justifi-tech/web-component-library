import { Component, h, Method, State } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import CustomerDetailsSchema from "./schemas/customer-details-schema";

@Component({
  tag: 'justifi-customer-details',
})
export class CustomerDetails {
  @State() form: FormController;
  @State() errors: any = {};

  @Method()
  async validateAndSubmit(onSuccess: (formData: any) => void) {
    this.form.validateAndSubmit((formData) => onSuccess(formData));
  };

  componentWillLoad() {
    this.form = new FormController(CustomerDetailsSchema);
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
            <h2 class="h5">Customer Details</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Full Name"
              name="customer_name"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              label="Email"
              name="customer_email_address"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            {/* TODO: Make this a text area later */}
            <form-control-textarea
              label="Billing Address"
              name="customer_billing_address"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Customer Signature"
              name="customer_signature"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Customer Communication"
              name="customer_communication"
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </div>
    );
  }
};
