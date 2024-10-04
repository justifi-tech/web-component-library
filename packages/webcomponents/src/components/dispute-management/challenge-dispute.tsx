import { Component, h } from "@stencil/core";

@Component({
  tag: 'justifi-challenge-dispute',
})
export class ChallengeDispute {

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h1 class="h4">Challenge Dispute</h1>
          </div>

          <div class="col-12">
            <h2 class="h5">Upload evidence</h2>
            <p>
              Upload as much of the recommended evidence as possible to build the best case for your counter-dispute.
              If you have additional evidence you would like to provide you may upload it as well.
            </p>
            <ul>
              <li>Customer communication</li>
              <li>Customer signature</li>
              <li>Shipping documentation</li>
              <li>Receipt</li>
              <li>Other evidence</li>
            </ul>
            <form-control-file
              name="evidence"
              label="Upload files"
              multiple={true}
            />
          </div>

          <div class="col-12">
            <h2 class="h5">Customer details</h2>
            <div class="row gy-3">
              <div class="col-12">
                <form-control-text
                  name="customerName"
                  label="Customer name"
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="email"
                  label="Email"
                />
              </div>
              <div class="col-12">
                Billing address
              </div>
            </div>
          </div>

          <div class="col-12">
            <h2 class="h5">Shipping details</h2>
            <div class="row gy-3">
              <div class="col-12">
                Shipping address
              </div>
            </div>
          </div>

          <div class="col-12">
            <h2 class=""></h2>
          </div>
        </div>
      </div>
    );
  }
};
