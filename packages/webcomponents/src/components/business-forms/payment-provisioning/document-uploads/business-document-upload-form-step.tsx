import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../../ui-components/form/form';
import { BusinessFormStep, BusinessFormStepCompletedEvent, BusinessFormStepV2, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { Business, IBusiness } from '../../../../api/Business';
import Api, { IApiResponse } from '../../../../api/Api';
import { config } from '../../../../../config';
import { businessDocumentSchema } from '../../schemas/business-document-upload-schema';
import { FileSelectEvent } from '../../../../components';
import { EntityDocument, EntityDocumentStorage } from '../../../../api/Document';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { Skeleton } from '../../../../ui-components';

@Component({
  tag: 'justifi-business-document-upload-form-step',
})
export class BusinessDocumentFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() existingDocuments: any = [];
  @State() paymentVolume: string;
  @State() business: Business;
  @State() documentData: EntityDocumentStorage = new EntityDocumentStorage();
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ eventName: 'form-step-completed', bubbles: true }) stepCompleted: EventEmitter<BusinessFormStepCompletedEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`;
  }

  get documentEndpoint() {
    return 'entities/document';
  }

  componentWillLoad() {
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    if (this.businessId && this.authToken) {
      this.fetchData();
    }
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  private fetchData = async () => {
    this.renderState = 'loading';
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.business = { ...new Business(response.data) } as Business;
      this.existingDocuments = response.data.documents;
      this.paymentVolume = response.data.additional_questions.business_payment_volume;
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.FETCH_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
      this.renderState = 'error';
    } finally {
      this.initializeFormController();
      this.formLoading.emit(false);
      this.renderState = 'success';
    }
  }

  initializeFormController = () => {
    this.formController = new FormController(businessDocumentSchema(this.paymentVolume, this.existingDocuments, this.allowOptionalFields));
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  createDocumentRecord = async (docData: EntityDocument) => {
    this.formLoading.emit(true);
    const payload = docData.record_data;
    try {
      const response = await this.api.post(this.documentEndpoint, payload);
      return this.handleDocRecordResponse(docData, response);
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
      return false;
    }
  }

  handleDocRecordResponse = (docData: EntityDocument, response: any) => {
    if (response.error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: response.error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: response.error,
      })
      return false;
    } else {
      docData.setPresignedUrl(response.data.presigned_url);
      return true;
    }
  }

  uploadDocument = async (docData: EntityDocument) => {
    if (!docData.presigned_url) {
      throw new Error('Presigned URL is not set');
    }

    const response = await fetch(docData.presigned_url, {
      method: 'PUT',
      body: docData.fileString,
    })

    return this.handleUploadResponse(response);
  }

  handleUploadResponse = (response: any) => {
    if (response.error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: response.error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: response.error,
      })
      return false;
    } else {
      this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.documentUpload } });
      this.stepCompleted.emit({ data: response, formStep: BusinessFormStepV2.documentUpload });
      return true;
    }
  }

  storeFiles = (e: CustomEvent<FileSelectEvent>) => {
    const fileList = Array.from(e.detail.fileList) as File[];
    const docType = e.detail.document_type;
    const documentList = fileList.map(file => new EntityDocument({ file, document_type: docType }, this.businessId));
    this.documentData[docType] = documentList;
  }

  sendData = async (onSuccess?: () => void) => {
    try {
      const docArray = Object.values(this.documentData).flat();
      if (!docArray.length) {
        this.stepCompleted.emit({ data: null, formStep: BusinessFormStepV2.documentUpload, metadata: 'no data submitted' });
        return onSuccess();
      }

      const documentRecords = docArray.map(docData => this.createDocumentRecord(docData));
      const recordsCreated = await Promise.all(documentRecords);
      if (!recordsCreated) { return; }

      const uploads = docArray.map(docData => this.uploadDocument(docData));
      const uploadsCompleted = await Promise.all(uploads);
      if (!uploadsCompleted) { return; }

      await onSuccess();
    } finally {
      this.formLoading.emit(false);
    }
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  }

  get isLoading() {
    return this.renderState === 'loading';
  }

  get isError() {
    return this.renderState === 'error';
  }

  get documentsOnFile() {
    if (this.isError) {
      return null;
    }
    if (this.isLoading) {
      return <Skeleton variant='rounded' height={'50px'} />;
    }

    return <justifi-business-documents-on-file documents={this.existingDocuments} />;
  }

  get formInputs() {
    if (this.isError) {
      return null;
    }
    if (this.isLoading) {
      return <Skeleton variant='rounded' height={'350px'} />;
    }

    return (
      <justifi-business-document-upload-input-group
        paymentVolume={this.paymentVolume}
        inputHandler={this.inputHandler}
        storeFiles={this.storeFiles}
        errors={this.errors}
      />
    );
  }

  render() {
    return (
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0">Document Uploads</legend>
            <form-control-tooltip helpText="Various file formats such as PDF, DOC, DOCX, JPEG, and others are accepted. Multiple files can be uploaded for each document category." />
          </div>
          <hr class="mt-2" />
          {this.documentsOnFile}
          <div class="d-flex flex-column">
            {this.formInputs}
          </div>
        </fieldset>
      </form>
    );
  }
}
