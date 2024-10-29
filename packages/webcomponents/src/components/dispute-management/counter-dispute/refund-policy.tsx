import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-refund-policy',
})
export class RefundPolicy {

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Refund Policy</h2>
          </div>
          <div class="col-12">
            <form-control-textarea label="Refund Policy Disclosure" name="refund_policy_disclosure"></form-control-textarea>
          </div>
          <div class="col-12">
            <form-control-textarea label="Refund Refund Explanation" name="refund_refusal_explanation"></form-control-textarea>
          </div>
          <div class="col-12">
            <form-control-file label="Upload Refund Policy" name="refund_policy_file"></form-control-file>
          </div>
        </div>
      </div>
    );
  }
};
