import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-additional-statement',
})
export class AdditionalStatement {

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
            />
          </div>
          <div class="col-12">
            <form-control-file label="Additional files" name="uncategorized_file" multiple={true} helpText="Upload any additional pieces of evidence that have not already been provided." />
          </div>
        </div>
      </div>
    );
  }
};
