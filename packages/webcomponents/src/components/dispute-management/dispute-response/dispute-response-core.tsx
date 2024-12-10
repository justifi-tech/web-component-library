import { Component, Event, EventEmitter, h, State, Prop } from "@stencil/core";
import { DisputeManagementClickEvents } from "../dispute";
import { FormController } from "../../../ui-components/form/form";
import DisputeResponseSchema from "./schemas/dispute-reason-schema";
import { IApiResponse } from "../../../api";
import { IDispute } from "../../../api/Dispute";
import { ComponentError, DisputeEvidenceDocument } from "../../../components";

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
  @State() disputeResponse: any = {};
  @State() documentList = [];
  @State() currentStep = 0;
  @State() currentStepComponentRef: DisputeResponseStepElement;
  @State() formController: FormController;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;
  @Event() clickEvent: EventEmitter;

  componentStepMapping = [
    () => <justifi-product-or-service ref={(el) => this.currentStepComponentRef = el} />,
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

  saveData = async (formData: any): Promise<IApiResponse<IDispute>> => {
    return this.updateDisputeResponse({
      payload: formData,
      onSuccess: ({ disputeResponse }) => this.disputeResponse = disputeResponse,
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
      },
    });
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
    this.clickEvent.emit({ name: DisputeManagementClickEvents.cancelDispute });
  }

  private handleSubmit = async (formData, documentList) => {
    this.isLoading = true;

    if (formData) await this.saveData(formData);
    if (documentList.length) {
      this.documentList = documentList;
      await this.initializeMakePresignedURLs();
      await this.initializeFileUploads();
    }

    this.isLoading = false;
  }

  // after each of these steps where validateAndSubmit is called, reload the dispute
  // and set isLoading, and pass defaults into each step
  private onBack = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList) => {
      await this.handleSubmit(formData, documentList);
      this.clickEvent.emit({ name: DisputeManagementClickEvents.previousStep });
      this.currentStep--;
    });
  }

  private onNext = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList) => {
      await this.handleSubmit(formData, documentList);
      this.clickEvent.emit({ name: DisputeManagementClickEvents.nextStep });
      this.currentStep++;
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
