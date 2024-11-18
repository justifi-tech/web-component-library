import { Component, h, State, Method } from "@stencil/core";
import { FormController } from "../../form/form";
import AdditionalStatementSchema from "./schemas/additional-statement-schema";

@Component({
  tag: 'justifi-additional-statement',
})
export class AdditionalStatement {
  @State() form: FormController;
  @State() errors: any = {};

  @Method()
  async validateAndSubmit(onSuccess: () => void) {
    this.form.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.form = new FormController(AdditionalStatementSchema);
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
            <h2 class="h5">Additional Evidence</h2>
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Is there anything else you would like to say about this dispute?"
              name="additional_statement"
              inputHandler={this.inputHandler}
            />
          </div>
          <div class="col-12">
            <form-control-file
              label="Additional files"
              name="uncategorized_file"
              multiple={true}
              helpText="Upload any additional pieces of evidence that have not already been provided."
              inputHandler={this.inputHandler}
            />
          </div>
        </div>
      </div>
    );
  }
};
