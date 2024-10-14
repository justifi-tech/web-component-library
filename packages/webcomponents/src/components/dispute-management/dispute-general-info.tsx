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
              General dispute information description
            </p>
          </div>

          <div class="col-12">
            <h2 class="h5">Heading</h2>
            <div class="row gy-3">
              <div class="col-12"></div>
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
