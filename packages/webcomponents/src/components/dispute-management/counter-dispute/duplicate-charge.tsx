import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-duplicate-charge',
})
export class DuplicateCharge {

  render() {
    return (
      <div>

        <div class="row gy-3">
          <div class="col-12">
            <h2 class="h5">Duplicate Charge</h2>
          </div>
          <div class="col-12">
            <form-control-textarea label="Original Payment ID" name="duplicate_charge_original_payment_id"></form-control-textarea>
          </div>
          <div class="col-12">
            <form-control-textarea label="Duplicate Charge Explanation" name="duplicate_charge_explanation"></form-control-textarea>
          </div>
        </div>
      </div>
    );
  }
};
