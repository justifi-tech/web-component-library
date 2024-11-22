import { Component, Event, EventEmitter, h, State, Prop, Watch } from "@stencil/core";
import { DisputeManagementClickEvents } from "../dispute";
import { FormController } from "../../../ui-components/form/form";
import DisputeResponseSchema from "./schemas/dispute-reason-schema";
import { IDisputeResponse } from "../../../api/Dispute";
import { ComponentError } from "../../../components";

type DisputeResponseStepElement = HTMLElement & { validateAndSubmit: Function };

@Component({
  tag: 'justifi-dispute-response-core',
})
export class CounterDisputeCore {
  @Prop() getDisputeResponse: Function;

  @State() isLoading: boolean = true;
  @State() disputeResponse: IDisputeResponse;
  @State() currentStep = 0;
  @State() currentStepComponentRef: DisputeResponseStepElement;
  @State() formController: FormController;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;
  @Event() clickEvent: EventEmitter;

  componentStepMapping = [
    () => <justifi-dispute-reason ref={(el) => this.currentStepComponentRef = el}></justifi-dispute-reason>,
    () => <justifi-product-or-service ref={(el) => this.currentStepComponentRef = el}></justifi-product-or-service>,
    () => <justifi-customer-details ref={(el) => this.currentStepComponentRef = el}></justifi-customer-details>,
    () => <justifi-cancellation-policy ref={(el) => this.currentStepComponentRef = el}></justifi-cancellation-policy>,
    () => <justifi-refund-policy ref={(el) => this.currentStepComponentRef = el}></justifi-refund-policy>,
    () => <justifi-duplicate-charge ref={(el) => this.currentStepComponentRef = el}></justifi-duplicate-charge>,
    () => <justifi-electronic-evidence ref={(el) => this.currentStepComponentRef = el}></justifi-electronic-evidence>,
    () => <justifi-shipping-details ref={(el) => this.currentStepComponentRef = el}></justifi-shipping-details>,
    () => <justifi-additional-statement ref={(el) => this.currentStepComponentRef = el}></justifi-additional-statement>,
  ];

  componentWillLoad() {
    this.formController = new FormController(DisputeResponseSchema);

    if (this.getDisputeResponse) {
      this.fetchData();
    }
  }

  @Watch('getDisputeResponse')
  updateOnPropChange() {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    this.getDisputeResponse({
      onSuccess: ({ disputeResponse }) => {
        this.disputeResponse = disputeResponse;
        this.isLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
        this.isLoading = false;
      },
    });
  }

  saveData = () => {
  };

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  get isLastStep() {
    return this.currentStep === this.componentStepMapping.length - 1;
  }

  get isFirstStep() {
    return this.currentStep === 0;
  }

  private onCancel = () => {
    this.clickEvent.emit({ name: DisputeManagementClickEvents.cancelDispute });
  }

  // after each of these steps where validateAndSubmit is called, reload the dispute
  // and set isLoading, and pass defaults into each step
  private onBack = async () => {
    await this.currentStepComponentRef.validateAndSubmit(() => {
      this.currentStep--;
      this.clickEvent.emit({ name: DisputeManagementClickEvents.previousStep });
    });
  }

  private onNext = async () => {
    await this.currentStepComponentRef.validateAndSubmit(() => {
      this.currentStep++;
      this.clickEvent.emit({ name: DisputeManagementClickEvents.nextStep });
    });
  }

  private onSubmit = async () => {
    await this.currentStepComponentRef.validateAndSubmit(() => {
      this.clickEvent.emit({ name: DisputeManagementClickEvents.submit });
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
            {this.isFirstStep ? (
              <button class="btn btn-secondary" onClick={() => this.onCancel()}>
                Cancel
              </button>
            ) : (
              <button class="btn btn-secondary" onClick={() => this.onBack()}>
                Back
              </button>
            )}

            {this.isLastStep ? (
              <button class="btn btn-primary" onClick={() => this.onSubmit()}>
                Submit Counter Dispute
              </button>
            ) : (
              <button class="btn btn-primary" onClick={() => this.onNext()}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};
