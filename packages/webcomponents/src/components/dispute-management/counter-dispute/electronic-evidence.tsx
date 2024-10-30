import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-electronic-evidence',
})
export class ElectronicEvidence {

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Electronic Evidence</h2>
          </div>
          <div class="col-12">
            <form-control-text label="Purchase IP Address" name="customer_purchase_ip_address" />
          </div>
          <div class="col-12">
            <form-control-textarea label="Activity Logs" name="access_activity_log" />
          </div>
        </div>
      </div>
    );
  }
};
