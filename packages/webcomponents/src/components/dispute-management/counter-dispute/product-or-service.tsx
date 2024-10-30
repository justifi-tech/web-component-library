import { Component, h, State } from "@stencil/core";

const ProductOrServiceOptions = [
  { value: "", label: "Choose product or service..." },
  { value: "product", label: "Product" },
  { value: "service", label: "Service" },
]

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
            <h2 class="h5">Product or Service</h2>
          </div>
          <div class="col-12">
            <form-control-select
              label="Is this dispute about a product or service?"
              options={ProductOrServiceOptions}
              defaultValue=""
              inputHandler={(name, value) => {
                console.log(name, value);
                this.productOrService = value;
              }
              }>
            </form-control-select>
          </div>
        </div>

        {this.productOrService === "service" && (
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text label="Service Date" name="service_date" />
            </div>
            <div class="col-12">
              <form-control-file label="Service Documentation" name="service_documentation" />
            </div>
          </div>
        )}

        {this.productOrService === "product" && (
          <div class="row gy-3">
            <div class="col-12">
              <form-control-text label="Product Description" name="product_description" />
            </div>
          </div>
        )}
      </div>
    );
  }
};
