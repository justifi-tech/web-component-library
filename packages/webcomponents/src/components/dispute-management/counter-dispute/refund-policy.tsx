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
            <h2 class="h5">Refund Policy and Receipt</h2>
          </div>
          <div class="col-12">
            <form-control-textarea label="Refund Policy Disclosure" name="refund_policy_disclosure" />
          </div>
          <div class="col-12">
            <form-control-textarea label="Refund Refund Explanation" name="refund_refusal_explanation" />
          </div>
          <div class="col-12">
            <form-control-file label="Upload Refund Policy" name="refund_policy" />
          </div>
          <div class="col-12">
            <form-control-file label="Upload Receipt" name="receipt" />
          </div>
        </div>
      </div>
    );
  }
};
