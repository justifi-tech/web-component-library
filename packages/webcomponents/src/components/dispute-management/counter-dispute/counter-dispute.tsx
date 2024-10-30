import { Component, Event, EventEmitter, h, State } from "@stencil/core";
import { DisputeManagementClickEvents } from "../dispute";

@Component({
  tag: 'justifi-counter-dispute',
})
export class CounterDispute {
  @Event() submit: EventEmitter;
  @Event() clickEvent: EventEmitter;

  @State() currentStep = 0;
  @State() refs: any[] = [];

  componentStepMapping = [
    () => <justifi-dispute-reason ref={(el) => this.refs['disputeReason'] = el}></justifi-dispute-reason>,
    () => <justifi-product-or-service ref={(el) => this.refs['productOrService'] = el}></justifi-product-or-service>,
    () => <justifi-customer-details ref={(el) => this.refs['customerDetails'] = el}></justifi-customer-details>,
    () => <justifi-cancellation-policy ref={(el) => this.refs['cancellationPolicy'] = el}></justifi-cancellation-policy>,
    () => <justifi-refund-policy ref={(el) => this.refs['refundPolicy'] = el}></justifi-refund-policy>,
    () => <justifi-duplicate-charge ref={(el) => this.refs['duplicateCharge'] = el}></justifi-duplicate-charge>,
    () => <justifi-electronic-evidence ref={(el) => this.refs['electronicEvidence'] = el}></justifi-electronic-evidence>,
    () => <justifi-shipping-details ref={(el) => this.refs['shippingDetails'] = el}></justifi-shipping-details>,
    () => <justifi-additional-statement ref={(el) => this.refs['additionalStatement'] = el}></justifi-additional-statement>,
  ];

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  get isLastStep() {
    return this.currentStep === this.componentStepMapping.length - 1;
  }

  get isFirstStep() {
    return this.currentStep === 0;
  }

  onNext() {
    if (this.isLastStep) {
      this.submit.emit();
    } else {
      this.currentStep++;
      this.clickEvent.emit({ name: DisputeManagementClickEvents.nextStep });
    }
  }

  onBack() {
    if (this.isFirstStep) {
      this.clickEvent.emit({ name: DisputeManagementClickEvents.cancelDispute });
    } else {
      this.currentStep--;
      this.clickEvent.emit({ name: DisputeManagementClickEvents.previousStep });
    }
  }

  // Fields
  // "additional_statement": "...",

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <h1 class="h4">Counter dispute</h1>
        </div>

        <div class="col-12">
          {this.currentStepComponent}
        </div>

        <div class="col-12">
          <div class="d-flex gap-2 mt-4 justify-content-end">
            <button class="btn btn-secondary" onClick={() => this.onBack()}>
              {this.isFirstStep ? 'Cancel' : 'Back'}
            </button>
            <button class="btn btn-primary" onClick={() => this.onNext()}>
              {this.isLastStep ? 'Submit Counter Dispute' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
