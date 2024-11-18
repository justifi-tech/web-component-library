import { Component, h, State, Method } from "@stencil/core";
import { FormController } from "../../form/form";
import DuplicateChargeSchema from "./schemas/duplicate-charge-schema";

@Component({
  tag: 'justifi-duplicate-charge',
})
export class DuplicateCharge {
  @State() form: FormController;
  @State() errors: any = {};

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(DuplicateChargeSchema);
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
            <h2 class="h5">Duplicate Charge</h2>
          </div>
          <div class="col-12">
            <form-control-text
              label="Original Payment ID"
              name="duplicate_charge_original_payment_id"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Duplicate Charge Explanation"
              name="duplicate_charge_explanation"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Duplicate Charge Documentation"
              name="duplicate_charge_documentation"
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </div>
    );
  }
};
