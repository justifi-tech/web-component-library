import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-dispute-reason',
})
export class DisputeReason {

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <h2 class="h5">Why are you countering this dispute?</h2>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-radio name="disputeReason" label="The cardholder withdrew the dispute" value="reason1"></form-control-radio>
              <form-control-radio name="disputeReason" label="The cardholder received the product or service" value="reason2"></form-control-radio>
              <form-control-radio name="disputeReason" label="The cardholder was refunded" value="reason3"></form-control-radio>
              <form-control-radio
                name="disputeReason"
                label="The product, service, event or booking was cancelled or delayed due to a government order or other circumstances beyond your control"
                value="reason4">
              </form-control-radio>
              <form-control-radio name="disputeReason" label="Other" value="reason5"></form-control-radio>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
