import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-customer-details',
})
export class CustomerDetails {

  render() {
    return (
      <div>

        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Customer Details</h2>
          </div>
          <div class="col-12">
            <form-control-text label="Full Name" name="customer_name"></form-control-text>
          </div>
          <div class="col-12">
            <form-control-text label="Email" name="customer_email"></form-control-text>
          </div>
          <div class="col-12">
            <form-control-text label="Purchase IP Address" name="customer_ip_address"></form-control-text>
          </div>
          <div class="col-12">
            <form-control-text label="Billing Address" name="customer_billing_address"></form-control-text>
          </div>
        </div>
      </div>
    );
  }
};
