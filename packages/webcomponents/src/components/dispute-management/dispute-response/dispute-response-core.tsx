import { Component, Event, EventEmitter, h, State, Prop } from "@stencil/core";
import { DisputeManagementClickEvents, DisputeManagementClickEventNames, DisputeResponseSubmittedEvent } from "../dispute";
import { IApiResponse } from "../../../api";
import { IDispute } from "../../../api/Dispute";
import { ComponentError } from "../../../components";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import { DisputeResponseFormStep, DisputeResponseFormStepCompletedEvent } from "./dispute-response-form-types";

@Component({
  tag: 'justifi-dispute-response-core',
})
export class DisputeResponseCore {
  @Prop() updateDisputeResponse: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<IDispute>>;
  @Prop() submitDisputeResponse: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<IDispute>>;
  @Prop() createDisputeEvidence: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<any>>;
  @Prop() disputeResponse: any = {};

  @State() isLoading: boolean = false;
  @State() documentList = [];
  @State() currentStep = 0;
  @State() currentStepComponentRef: any;

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<DisputeManagementClickEvents>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;
  @Event({ eventName: 'form-step-completed', bubbles: true }) stepCompleted: EventEmitter<DisputeResponseFormStepCompletedEvent>;
  @Event({ bubbles: true }) submitted: EventEmitter<DisputeResponseSubmittedEvent>;

  componentStepMapping = [
    () => <justifi-product-or-service ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-customer-details ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-cancellation-policy ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-refund-policy ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-duplicate-charge ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-electronic-evidence ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-shipping-details ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
    () => <justifi-additional-statement ref={(el) => this.currentStepComponentRef = el} disputeResponse={this.disputeResponse} />,
  ];

  saveData = async (formData: any, formStep): Promise<IApiResponse<IDispute>> => {
    const hasFormData = Object.keys(formData).length;
    if (!hasFormData) {
      this.stepCompleted.emit({ data: null, formStep: formStep });
      return;
    }
    if (this.isLastStep) {
      return this.submitDisputeResponse({
        payload: formData,
        onSuccess: (response) => {
          this.disputeResponse = { ...response.data };
          this.submitted.emit({ data: response });
          this.stepCompleted.emit({ data: response, formStep: formStep });
        },
        onError: ({ error, code, severity }) => {
          this.errorEvent.emit({
            errorCode: code,
            message: error,
            severity,
          })
        },
      });
    } else {
      return this.updateDisputeResponse({
        payload: formData,
        onSuccess: (response) => {
          this.disputeResponse = { ...response.data };
          this.stepCompleted.emit({ data: response, formStep: formStep });
        },
        onError: ({ error, code, severity }) => {
          this.errorEvent.emit({
            errorCode: code,
            message: error,
            severity,
          })
        },
      });
    }
  }

  initializeMakePresignedURLs = async () => {
    const presignedUrlPromises: Promise<IApiResponse<any>>[] = this.documentList.map((document) => {
      return this.getPresignedFileUrl(document);
    });

    return await Promise.all(presignedUrlPromises);
  }

  initializeFileUploads = async () => {
    const uploadDocumentPromises: Promise<Response>[] = this.documentList.map((document) => {
      return this.uploadDocument(document);
    });

    return Promise.all(uploadDocumentPromises);
  }

  getPresignedFileUrl = async (document: DisputeEvidenceDocument): Promise<IApiResponse<any>> => {
    return this.createDisputeEvidence({
      payload: {
        file_name: document.file_name,
        file_type: document.file_type,
        dispute_evidence_type: document.dispute_evidence_type,
      },
      onSuccess: (response) => {
        document.presignedUrl = response.data.presigned_url;
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

  uploadDocument = async (document: DisputeEvidenceDocument): Promise<Response> => {
    const fileData = await document.getFileString();

    if (!document.presignedUrl) {
      throw new Error('Presigned URL is not set');
    }

    const response = await fetch(document.presignedUrl, {
      method: 'PUT',
      body: fileData,
    });

    return response;
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
    this.clickEvent.emit({ name: DisputeManagementClickEventNames.cancelDispute });
  }

  private handleSubmit = async (formData, documentList, formStep: DisputeResponseFormStep) => {
    this.isLoading = true;

    if (documentList.length) {
      this.documentList = documentList;
      await this.initializeMakePresignedURLs();
      await this.initializeFileUploads();
    }
    // this needs to happen last because it fires the 'submitted' and 'form-step-completed' event
    await this.saveData(formData, formStep);

    this.isLoading = false;
  }

  // after each of these steps where validateAndSubmit is called, reload the dispute
  // and set isLoading, and pass defaults into each step
  private onBack = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickEventNames.previousStep });
      await this.handleSubmit(formData, documentList, formStep);
      this.currentStep--;
    });
  }

  private onNext = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickEventNames.nextStep });
      await this.handleSubmit(formData, documentList, formStep);
      this.currentStep++;
    });
  }

  private onSubmit = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickEventNames.submit });
      const submitData = { ...formData, forfeit: false };
      await this.handleSubmit(submitData, documentList, formStep);
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
