import { Component, h } from "@stencil/core";


@Component({
  tag: 'justifi-counter-dispute',
})
export class CounterDispute {

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <h1 class="h4">Counter dispute</h1>
        </div>

        <div class="col-12">
          <justifi-dispute-reason></justifi-dispute-reason>
        </div>

        <div class="col-12">
          <div class="d-flex gap-2 mt-4 justify-content-end">
            <button class="btn btn-secondary">Cancel</button>
            <button class="btn btn-primary">Submit Counter Dispute</button>
          </div>
        </div>
      </div>
    );
  }
};
