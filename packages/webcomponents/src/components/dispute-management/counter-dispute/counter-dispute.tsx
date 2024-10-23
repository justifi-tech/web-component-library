import { Component, Event, EventEmitter, h, State } from "@stencil/core";

export enum DisputeManagementClickEvents {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit',
}

@Component({
  tag: 'justifi-counter-dispute',
})
export class CounterDispute {
  @Event() submit: EventEmitter;
  @Event() clickEvent: EventEmitter;

  @State() currentStep = 0;
  @State() refs: any[] = [];

  componentStepMapping = [
    () => <justifi-dispute-reason ref={(el) => this.refs[0] = el}></justifi-dispute-reason>,
    () => <justifi-upload-dispute-evidence ref={(el) => this.refs[1] = el}></justifi-upload-dispute-evidence>,
  ];

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  get isLastStep() {
    return this.currentStep === this.componentStepMapping.length - 1;
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
    if (this.currentStep === 0) {
      this.clickEvent.emit({ name: 'cancelDispute' });
    } else {
      this.currentStep--;
      this.clickEvent.emit({ name: DisputeManagementClickEvents.previousStep });
    }
  }

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
            <button class="btn btn-secondary" onClick={() => this.onBack()}>Cancel</button>
            <button class="btn btn-primary" onClick={() => this.onNext()}>
              {this.isLastStep ? 'Next' : 'Submit Counter Dispute'}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
