import { Component, h, State } from "@stencil/core";

@Component({
  tag: 'justifi-product-or-service',
})
export class ProductOrService {
  @State() productOrService: string;

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Product & Service Details</h2>
          </div>
          <div class="col-12">
            <form-control-text label="Product Description" name="product_description" />
          </div>
          <div class="col-12">
            <form-control-text label="Service Date" name="service_date" />
          </div>
          <div class="col-12">
            <form-control-file label="Service Documentation" name="service_documentation" />
          </div>
        </div>
      </div>
    );
  }
};
