import { Component, Event, EventEmitter, h, State, Prop } from "@stencil/core";
import { IApiResponse } from "../../../api";
import { IDispute } from "../../../api/Dispute";
import { DisputeEvidenceDocument } from "../../../api/DisputeEvidenceDocument";
import {
  ComponentClickEvent,
  ComponentFormStepCompleteEvent,
  ComponentSubmitEvent,
  ComponentErrorEvent
} from "../../../api/ComponentEvents";
import { DisputeManagementClickActions, DisputeResponseFormStep } from "../event-types";
import { heading4 } from "../../../styles/parts";
import { Button } from "../../../ui-components/button";

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

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'submit-event', bubbles: true }) submitEvent: EventEmitter<ComponentSubmitEvent>;

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
      this.stepCompleteEvent.emit({ response: null, formStep: formStep });
      return;
    }
    if (this.isLastStep) {
      return this.submitDisputeResponse({
        payload: formData,
        onSuccess: (response) => {
          this.submitEvent.emit({ response: response });
          this.stepCompleteEvent.emit({ response: response, formStep: formStep });
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
          this.stepCompleteEvent.emit({ response: response, formStep: formStep });
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
    this.clickEvent.emit({ name: DisputeManagementClickActions.cancelDispute });
  }

  private handleSubmit = async (formData, documentList, formStep: DisputeResponseFormStep) => {
    this.isLoading = true;

    if (documentList.length) {
      this.documentList = documentList;
      await this.initializeMakePresignedURLs();
      await this.initializeFileUploads();
    }
    // this needs to happen last because it fires the 'submit-event' and 'complete-form-step-event' event
    await this.saveData(formData, formStep);

    this.isLoading = false;
  }

  // after each of these steps where validateAndSubmit is called, reload the dispute
  // and set isLoading, and pass defaults into each step
  private onBack = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickActions.previousStep });
      await this.handleSubmit(formData, documentList, formStep);
      this.currentStep--;
    });
  }

  private onNext = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickActions.nextStep });
      await this.handleSubmit(formData, documentList, formStep);
      this.currentStep++;
    });
  }

  private onSubmit = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickActions.submit });
      const submitData = { ...formData, forfeit: false };
      await this.handleSubmit(submitData, documentList, formStep);
    });
  }

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <h1 class="h4" part={heading4}>Counter dispute</h1>
        </div>

        <div class="col-12">
          {this.currentStepComponent}
        </div>

        <div class="col-12">
          <div class="d-flex gap-2 mt-4 justify-content-end">
            {this.isFirstStep ? (
              <Button
                variant="secondary"
                onClick={() => this.onCancel()}
                disabled={this.isLoading}
                isLoading={this.isLoading}>
                Cancel
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => this.onBack()}
                disabled={this.isLoading}
                isLoading={this.isLoading}>
                Back
              </Button>
            )}

            {this.isLastStep ? (
              <Button
                variant="primary"
                onClick={() => this.onSubmit()}
                disabled={this.isLoading}
                isLoading={this.isLoading}>
                Submit Counter Dispute
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => this.onNext()}
                disabled={this.isLoading}
                isLoading={this.isLoading}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
};
