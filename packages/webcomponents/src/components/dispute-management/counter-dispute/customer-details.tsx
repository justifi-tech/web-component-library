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
            <form-control-text label="Full Name" name="customer_name" />
          </div>
          <div class="col-12">
            <form-control-text label="Email" name="customer_email_address" />
          </div>
          <div class="col-12">
            {/* TODO: Make this a text area later */}
            <form-control-textarea label="Billing Address" name="customer_billing_address" />
          </div>
          <div class="col-12">
            <form-control-file label="Customer Signature" name="customer_signature" />
          </div>
          <div class="col-12">
            <form-control-file label="Customer Communication" name="customer_communication" />
          </div>
        </div>
      </div>
    );
  }
};
