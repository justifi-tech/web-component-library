import { Component, h, Prop, State } from "@stencil/core";
import { FormController } from "../../form/form";

@Component({
  tag: 'justifi-dispute-reason',
})
export class DisputeReason {
  @Prop() form: FormController;
  @State() errors: any = {};

  componentDidLoad() {
    this.form.errors.subscribe(errors => this.errors = { ...errors });
  }

  private inputHandler = (name: string, value: string) => {
    this.form.setValues({
      ...this.form.values.getValue(),
      [name]: value
    });
  }

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <h2 class="h5">Why are you countering this dispute?</h2>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-radio
                name="reason"
                label="The cardholder withdrew the dispute"
                inputHandler={this.inputHandler}
                hasError={!!this.errors.reason}
                value="withdrawn">
              </form-control-radio>
              <form-control-radio
                name="reason"
                label="The cardholder received the product or service"
                inputHandler={this.inputHandler}
                hasError={!!this.errors.reason}
                value="did_not_receive">
              </form-control-radio>
              <form-control-radio
                name="reason"
                label="The cardholder was refunded"
                inputHandler={this.inputHandler}
                hasError={!!this.errors.reason}
                value="refunded">
              </form-control-radio>
              <form-control-radio
                name="reason"
                label="The product, service, event or booking was cancelled or delayed due to a government order or other circumstances beyond your control"
                inputHandler={this.inputHandler}
                hasError={!!this.errors.reason}
                value="unforseen_circumstances">
              </form-control-radio>
              <form-control-radio
                name="reason"
                label="Other"
                inputHandler={this.inputHandler}
                hasError={!!this.errors.reason}
                value="other">
              </form-control-radio>
              <form-control-error-text errorText={this.errors.reason} name="reason" />
            </div>
          </div>
        </div>
      </div>
    );
  }
};
