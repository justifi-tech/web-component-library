import { Component, h, State, Method } from "@stencil/core";
import { FormController } from "../../form/form";
import ShippingDetailsSchema from "./schemas/shipping-details-schema";

@Component({
  tag: 'justifi-shipping-details',
})
export class ShippingDetails {
  @State() form: FormController;
  @State() errors: any = {};

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(ShippingDetailsSchema);
  }

  componentDidLoad() {
    this.form.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private sendData = (onSuccess: () => void) => {
    onSuccess();
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
            <h2 class="h5">Shipping Details</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Shipping Carrier Name"
              name="shipping_carrier"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-text
              label="Tracking Number"
              name="shipping_tracking_number"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-date
              label="Date Shipped"
              name="shipping_date"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            {/* TODO: Make this a text area later */}
            <form-control-textarea
              label="Shipping Address"
              name="shipping_address"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Shipping Documentation"
              name="shipping_documentation"
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </div>
    );
  }
};
