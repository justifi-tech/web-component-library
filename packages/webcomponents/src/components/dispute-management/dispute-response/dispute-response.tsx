import { Component, h, Watch, State, Prop, Event, EventEmitter } from '@stencil/core';
import { checkPkgVersion } from '../../../utils/check-pkg-version';
import {
  makeCreateDisputeEvidence,
  makeUpdateDisputeResponse,
  makeSubmitDisputeResponse,
} from './dispute-response-actions';
import { Dispute } from '../../../components';
import { DisputeResponse as ApiDisputeResponse, IApiResponse } from '../../../api';
import JustifiAnalytics from '../../../api/Analytics';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';
import { DisputeService } from '../../../api/services/dispute.service';
import { ComponentErrorEvent } from '../../../api/ComponentEvents';
import { DisputeEvidenceDocument } from '../../../api/DisputeEvidenceDocument';
import {
  ComponentClickEvent,
  ComponentFormStepCompleteEvent,
  ComponentSubmitEvent,
} from '../../../api/ComponentEvents';
import { DisputeManagementClickActions, DisputeResponseFormStep } from '../event-types';
import { heading4 } from '../../../styles/parts';
import { Button } from '../../../ui-components/button';

@Component({
  tag: 'dispute-response',
  shadow: false,
})
export class DisputeResponse {
  @State()
  updateDisputeResponse: (args: {
    payload: any;
    onSuccess: (disputeResponse: any) => void;
    onError: (disputeResponse: any) => void;
  }) => Promise<IApiResponse<Dispute>>;
  @State()
  submitDisputeResponse: (args: {
    payload: any;
    onSuccess: (disputeResponse: any) => void;
    onError: (disputeResponse: any) => void;
  }) => Promise<IApiResponse<Dispute>>;
  @State()
  createDisputeEvidence: (args: {
    payload: any;
    onSuccess: (disputeResponse: any) => void;
    onError: (disputeResponse: any) => void;
  }) => Promise<IApiResponse<any>>;
  @State() errorMessage: string = null;

  @Prop() authToken!: string;
  @Prop() disputeId!: string;
  @Prop() disputeResponse: ApiDisputeResponse | any = {};
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;

  @State() isLoading: boolean = false;
  @State() documentList = [];
  @State() documentErrors = {};
  @State() currentStep = 0;
  @State() currentStepComponentRef: any;

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'submit-event', bubbles: true }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  analytics: JustifiAnalytics;

  componentStepMapping = [
    () => (
      <product-or-service
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <customer-details
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <cancellation-policy
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <refund-policy
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <duplicate-charge
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <electronic-evidence
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <shipping-details
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
    () => (
      <additional-statement
        ref={(el) => (this.currentStepComponentRef = el)}
        disputeResponse={this.disputeResponse}
        documentErrors={this.documentErrors}
      />
    ),
  ];

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeDisputeServiceMethods();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Watch('disputeId')
  @Watch('authToken')
  propChanged() {
    this.initializeDisputeServiceMethods();
  }

  private initializeDisputeServiceMethods() {
    if (this.disputeId && this.authToken) {
      this.updateDisputeResponse = makeUpdateDisputeResponse({
        disputeId: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService(),
      });
      this.createDisputeEvidence = makeCreateDisputeEvidence({
        disputeId: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService(),
      });
      this.submitDisputeResponse = makeSubmitDisputeResponse({
        disputeId: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService(),
      });
    } else {
      this.errorMessage = 'Account ID and Auth Token are required';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
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

  saveData = async (formData: any, formStep): Promise<IApiResponse<Dispute>> => {
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
          });
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
          });
        },
      });
    }
  };

  initializeMakePresignedURLs = async () => {
    const presignedUrlPromises: Promise<IApiResponse<any>>[] = this.documentList.map((document) => {
      return this.getPresignedFileUrl(document);
    });

    return await Promise.all(presignedUrlPromises);
  };

  initializeFileUploads = async () => {
    const uploadDocumentPromises: Promise<Response>[] = this.documentList.map((document) => {
      return this.uploadDocument(document);
    });

    return Promise.all(uploadDocumentPromises);
  };

  getPresignedFileUrl = async (document: DisputeEvidenceDocument): Promise<IApiResponse<any>> => {
    return this.createDisputeEvidence({
      payload: {
        file_name: document.file_name,
        file_type: document.file_type,
        dispute_evidence_type: document.dispute_evidence_type,
      },
      onSuccess: (response) => {
        document.presignedUrl = response.data.presigned_url;
      },
      onError: ({ error, code, severity }) => {
        const errors = { [document.dispute_evidence_type]: error };
        this.documentErrors = { ...this.documentErrors, ...errors };
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      },
    });
  };

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
  };

  private handleSubmit = async (formData, documentList, formStep: DisputeResponseFormStep) => {
    this.isLoading = true;

    if (documentList.length) {
      this.documentErrors = {};
      this.documentList = documentList;

      await this.initializeMakePresignedURLs();
      const hasPresigningErrors = Object.keys(this.documentErrors).length;

      if (hasPresigningErrors) {
        this.isLoading = false;
        throw new Error('Could not presign all documents');
      }

      await this.initializeFileUploads();
    }
    await this.saveData(formData, formStep);

    this.isLoading = false;
  };

  private onCancel = () => {
    this.clickEvent.emit({ name: DisputeManagementClickActions.cancelDispute });
  };

  private onBack = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickActions.previousStep });
      await this.handleSubmit(formData, documentList, formStep);
      this.currentStep--;
    });
  };

  private onNext = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickActions.nextStep });
      await this.handleSubmit(formData, documentList, formStep);
      this.currentStep++;
    });
  };

  private onSubmit = async () => {
    await this.currentStepComponentRef.validateAndSubmit(async (formData, documentList, formStep: DisputeResponseFormStep) => {
      this.clickEvent.emit({ name: DisputeManagementClickActions.submit });
      const submitData = { ...formData, forfeit: false };
      await this.handleSubmit(submitData, documentList, formStep);
    });
  };

  render() {
    return (
      <div class="dispute-response-root">
        <div class="row gy-3">
          <div class="col-12">
            <h1 class="h4" part={heading4}>
              Counter dispute
            </h1>
          </div>

          <div class="col-12">{this.currentStepComponent}</div>

          <div class="col-12">
            <div class="d-flex gap-2 mt-4 justify-content-end">
              {this.isFirstStep ? (
                <Button variant="secondary" onClick={() => this.onCancel()} disabled={this.isLoading} isLoading={this.isLoading}>
                  Cancel
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => this.onBack()} disabled={this.isLoading} isLoading={this.isLoading}>
                  Back
                </Button>
              )}

              {this.isLastStep ? (
                <Button variant="primary" onClick={() => this.onSubmit()} disabled={this.isLoading} isLoading={this.isLoading}>
                  Submit Counter Dispute
                </Button>
              ) : (
                <Button variant="primary" onClick={() => this.onNext()} disabled={this.isLoading} isLoading={this.isLoading}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
