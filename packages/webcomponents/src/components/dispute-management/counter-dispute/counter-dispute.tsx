import { Component, Event, EventEmitter, h, State } from "@stencil/core";
import { DisputeManagementClickEvents } from "../dispute";
import { CounterDisputeFormStep } from "./counter-dispute-form-types";
import { FormController } from "../../form/form";
import { disputeResponseSchema } from "./schemas/dispute-reason-schema";

@Component({
  tag: 'justifi-counter-dispute',
})
export class CounterDispute {
  @Event() clickEvent: EventEmitter;

  @State() currentStep = 0;
  @State() refs: any[] = [];
  @State() formController: FormController;


  // temp piece of state to hold form values
  @State() values: any = {};

  componentWillLoad() {
    this.formController = new FormController(disputeResponseSchema());
    // temp subscription to values
    this.formController.values.subscribe(values => this.values = values);
  }

  componentStepMapping = [
    () => (
      <justifi-dispute-reason
        ref={(el) => this.refs[CounterDisputeFormStep.disputeReason] = el}
        form={this.formController}>
      </justifi-dispute-reason>
    ),
    () => (
      <justifi-product-or-service
        ref={(el) => this.refs[CounterDisputeFormStep.productOrService] = el}
        form={this.formController}>
      </justifi-product-or-service>
    ),
    () => <justifi-customer-details ref={(el) => this.refs[CounterDisputeFormStep.customerDetails] = el}></justifi-customer-details>,
    () => <justifi-cancellation-policy ref={(el) => this.refs[CounterDisputeFormStep.cancellationPolicy] = el}></justifi-cancellation-policy>,
    () => <justifi-refund-policy ref={(el) => this.refs[CounterDisputeFormStep.refundPolicy] = el}></justifi-refund-policy>,
    () => <justifi-duplicate-charge ref={(el) => this.refs[CounterDisputeFormStep.duplicateCharge] = el}></justifi-duplicate-charge>,
    () => <justifi-electronic-evidence ref={(el) => this.refs[CounterDisputeFormStep.electronicEvidence] = el}></justifi-electronic-evidence>,
    () => <justifi-shipping-details ref={(el) => this.refs[CounterDisputeFormStep.shippingDetails] = el}></justifi-shipping-details>,
    () => <justifi-additional-statement ref={(el) => this.refs[CounterDisputeFormStep.additionalStatement] = el}></justifi-additional-statement>,
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

  private onNext = async () => {
    await this.formController.validateAndSubmit(() => {
      if (this.isLastStep) {
        this.clickEvent.emit({ name: DisputeManagementClickEvents.submit });
      } else {
        this.currentStep++;
        this.clickEvent.emit({ name: DisputeManagementClickEvents.nextStep });
      }
    });
  }

  private onBack = async () => {
    await this.formController.validateAndSubmit(() => {
      if (this.isFirstStep) {
        this.clickEvent.emit({ name: DisputeManagementClickEvents.cancelDispute });
      } else {
        this.currentStep--;
        this.clickEvent.emit({ name: DisputeManagementClickEvents.previousStep });
      }
    });
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
