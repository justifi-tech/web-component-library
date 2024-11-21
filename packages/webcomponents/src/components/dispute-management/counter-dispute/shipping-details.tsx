import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-shipping-details',
})
export class ShippingDetails {

  // "shipping_address": "...",
  // "shipping_carrier": "...",
  // "shipping_date": "...",
  // "shipping_tracking_number": "...",

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Shipping Details</h2>
          </div>
          <div class="col-12">
            <form-control-text label="Shipping Carrier Name" name="shipping_carrier" />
          </div>
          <div class="col-12">
            <form-control-text label="Tracking Number" name="shipping_tracking_number" />
          </div>
          <div class="col-12">
            <form-control-date label="Date Shipped" name="shipping_date" />
          </div>
          <div class="col-12">
            {/* TODO: Make this a text area later */}
            <form-control-textarea label="Shipping Address" name="shipping_address" />
          </div>
          <div class="col-12">
            <form-control-file label="Shipping Documentation" name="shipping_documentation" />
          </div>
        </div>
      </div>
    );
  }
};
