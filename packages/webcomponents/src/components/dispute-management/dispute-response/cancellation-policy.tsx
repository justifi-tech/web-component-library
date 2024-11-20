import { Component, h, State, Method } from "@stencil/core";
import { FormController } from "../../../ui-components/form/form";
import CancellationPolicySchema from "./schemas/cancellation-policy-schema";

@Component({
  tag: 'justifi-cancellation-policy',
})
export class CancellationPolicy {
  @State() form: FormController;
  @State() errors: any = {};

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(CancellationPolicySchema);
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
            <h2 class="h5">Cancellation Policy</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Cancellation Policy Disclosure"
              name="cancellation_policy_disclosure"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Cancellation Rebuttal"
              name="cancellation_rebuttal"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Upload Cancellation Policy"
              name="cancellation_policy_file"
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </div>
    );
  }
};
