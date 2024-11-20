import { Component, h, State, Method } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import RefundPolicySchema from "./schemas/refund-policy-schema";

@Component({
  tag: 'justifi-refund-policy',
})
export class RefundPolicy {
  @State() form: FormController;
  @State() errors: any = {};

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(RefundPolicySchema);
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
            <h2 class="h5">Refund Policy and Receipt</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Refund Policy Disclosure"
              name="refund_policy_disclosure"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Refund Refund Explanation"
              name="refund_refusal_explanation"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Upload Refund Policy"
              name="refund_policy"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Upload Receipt"
              name="receipt"
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </div>
    );
  }
};
