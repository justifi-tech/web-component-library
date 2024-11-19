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
            <form-control-text
              label="Purchase IP Address"
              name="customer_purchase_ip_address"
              helpText="The IP address used by the customer during the purchase."
            />
          </div>
          <div class="col-12">
            <form-control-textarea
              label="Activity Logs"
              name="access_activity_log"
              helpText="Any server or activity logs that provide evidence of the customer's access to or download of the purchased digital product. This information should encompass IP addresses, relevant timestamps, and any detailed records of activity."
            />
          </div>
        </div>
      </div>
    );
  }
};
