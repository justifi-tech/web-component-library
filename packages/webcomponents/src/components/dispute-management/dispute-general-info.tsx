import { Component, h, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: 'justifi-general-dispute-info',
})
export class UploadDisputeEvidence {
  @Event() updateStep: EventEmitter<{ step: 'back' | 'next' }>;

  back() {
    this.updateStep.emit({ step: 'back' });
  }

  next() {
    this.updateStep.emit({ step: 'next' });
  }

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h1 class="h4">Counter dispute</h1>
          </div>

          <div class="col-12">
            <h2 class="h5">Step 1: General Dispute information</h2>
            <p>
              By answering the following questions we will be able to better understand the dispute and help you provide the necessary evidence to counter it.
            </p>
          </div>

          <div class="col-12">
            <h2 class="h5">Why are you countering this dispute?</h2>
            <div class="row gy-3">
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason1" value="reason1" />
                  <label class="form-check-label" htmlFor="reason1">
                    The cardholder withdrew the dispute
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason2" value="reason2" />
                  <label class="form-check-label" htmlFor="reason2">
                    The cardholder received the product or service
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason3" value="reason3" />
                  <label class="form-check-label" htmlFor="reason3">
                    The cardholder was refunded
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason4" value="reason4" />
                  <label class="form-check-label" htmlFor="reason4">
                    The product, service, event or booking was cancelled or delayed due to a government order or other circumstances beyond your control
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason5" value="reason5" />
                  <label class="form-check-label" htmlFor="reason5">
                    Other
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <h2 class="h5">Details about the product or service</h2>
            <div class="row gy-3">
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="productDetail" id="detail1" value="detail1" />
                  <label class="form-check-label" htmlFor="detail1">
                    Physical product
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="productDetail" id="detail2" value="detail2" />
                  <label class="form-check-label" htmlFor="detail2">
                    Digital product or service
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="productDetail" id="detail3" value="detail3" />
                  <label class="form-check-label" htmlFor="detail3">
                    Offline service
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="productDetail" id="detail4" value="detail4" />
                  <label class="form-check-label" htmlFor="detail4">
                    Event
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="productDetail" id="detail5" value="detail5" />
                  <label class="form-check-label" htmlFor="detail5">
                    Booking or reservation
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="productDetail" id="detail6" value="detail6" />
                  <label class="form-check-label" htmlFor="detail6">
                    Other
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="d-flex gap-2 mt-4 justify-content-end">
          <button class="btn btn-secondary" onClick={() => this.back()}>Back</button>
          <button class="btn btn-primary" onClick={() => this.next()}>Next</button>
        </div>
      </div>
    );
  }
};
