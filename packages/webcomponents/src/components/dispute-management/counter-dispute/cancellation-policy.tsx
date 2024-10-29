import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-cancellation-policy',
})
export class CancellationPolicy {

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Cancellation Policy</h2>
          </div>
          <div class="col-12">
            <form-control-textarea label="Cancellation Policy Disclosure" name="cancellation_policy_disclosure"></form-control-textarea>
          </div>
          <div class="col-12">
            <form-control-textarea label="Cancellation Rebuttal" name="cancellation_rebuttal"></form-control-textarea>
          </div>
          <div class="col-12">
            <form-control-file label="Upload Cancellation Policy" name="cancellation_policy_file"></form-control-file>
          </div>
        </div>
      </div>
    );
  }
};
