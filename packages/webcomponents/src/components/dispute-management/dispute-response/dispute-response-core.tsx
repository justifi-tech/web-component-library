import { Component, Event, EventEmitter, h, State, Prop } from "@stencil/core";
import { DisputeManagementClickEvents } from "../dispute";
import { FormController } from "../../../ui-components/form/form";
import DisputeResponseSchema from "./schemas/dispute-reason-schema";
import { IApiResponse } from "../../../api";
import { DisputeResponseDocument, IDispute, IDisputeResponse } from "../../../api/Dispute";
import { ComponentError, FileSelectEvent } from "../../../components";

type DisputeResponseStepElement = HTMLElement & { validateAndSubmit: Function };

@Component({
  tag: 'justifi-dispute-response-core',
})
export class DisputeResponseCore {
  @Prop() updateDisputeResponse: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<IDispute>>;
  @Prop() createDisputeEvidence: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<any>>;

  @State() isLoading: boolean = false;
  @State() disputeResponse: IDisputeResponse;
  @State() currentStep = 0;
  @State() currentStepComponentRef: DisputeResponseStepElement;
  @State() formController: FormController;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;
  @Event() clickEvent: EventEmitter;

  componentStepMapping = [
    // () => <justifi-dispute-reason ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-product-or-service ref={(el) => this.currentStepComponentRef = el} handleFileSelection={this.handleFileSelection} />,
    () => <justifi-customer-details ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-cancellation-policy ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-refund-policy ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-duplicate-charge ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-electronic-evidence ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-shipping-details ref={(el) => this.currentStepComponentRef = el} />,
    () => <justifi-additional-statement ref={(el) => this.currentStepComponentRef = el} />,
  ];

  componentWillLoad() {
    this.formController = new FormController(DisputeResponseSchema);
  }

  saveData = async (formData: any):
    Promise<IApiResponse<IDispute>> => {
    this.isLoading = true;

    return this.updateDisputeResponse({
      payload: formData,
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

  handleFileSelection = (e: CustomEvent<FileSelectEvent>) => {
    this.isLoading = true;
    const fileList = Array.from(e.detail.fileList) as File[];
    const documentList = fileList.map(file => new DisputeResponseDocument(file));
    documentList.forEach(async doc => await this.getPresignedFileUrl(doc));
  }

  getPresignedFileUrl = async (document: any) => {
    console.log('doc from dispute-response-core', document);
    this.createDisputeEvidence({
      payload: document,
      onSuccess: () => {
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
    })
  }

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
    await this.currentStepComponentRef.validateAndSubmit(async (data) => {
      await this.saveData(data);
      this.currentStep--;
      this.clickEvent.emit({ name: DisputeManagementClickEvents.previousStep });
    });
  }

  private onNext = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (data) => {
      await this.saveData(data);
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
              <button class="btn btn-secondary" onClick={() => this.onCancel()} disabled={this.isLoading}>
                Cancel
              </button>
            ) : (
              <button class="btn btn-secondary" onClick={() => this.onBack()} disabled={this.isLoading}>
                Back
              </button>
            )}

            {this.isLastStep ? (
              <button class="btn btn-primary" onClick={() => this.onSubmit()} disabled={this.isLoading}>
                Submit Counter Dispute
              </button>
            ) : (
              <button class="btn btn-primary" onClick={() => this.onNext()} disabled={this.isLoading}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};
