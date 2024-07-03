import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormStep, BusinessFormSubmitEvent, DocumentFormServerErrorEvent, DocumentFormServerErrors } from '../../utils/business-form-types';
import { Business, IBusiness } from '../../../../api/Business';
import Api, { IApiResponse } from '../../../../api/Api';
import { config } from '../../../../../config';
import { businessDocumentSchema } from '../../schemas/business-document-upload-schema';
import { FileSelectEvent } from '../../../../components';
import { EntityDocument, EntityDocumentStorage } from '../../../../api/Document';

@Component({
  tag: 'justifi-business-document-upload-form-step',
})
export class BusinessDocumentFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() paymentVolume: string;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() documents: any = [];
  @State() business: Business;
  @State() documentData: EntityDocumentStorage = new EntityDocumentStorage();
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<DocumentFormServerErrorEvent>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`;
  }

  get documentEndpoint() {
    return 'entities/document';
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessDocumentSchema(this.paymentVolume, this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.documents = { ...values }
    );
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
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
      this.business = { ...new Business(response.data) };
    } catch (error) {
      this.serverError.emit({ data: error, message: DocumentFormServerErrors.fetchData });
      this.renderState = 'error';
    } finally {
      this.formLoading.emit(false);
      this.renderState = 'success';
      this.documents = this.business.documents;
    }
  }

  createDocumentRecord = async (docData: EntityDocument) => {
    this.formLoading.emit(true);
    const payload = docData.record_data;
    try {
      const response = await this.api.post(this.documentEndpoint, JSON.stringify(payload));
      return this.handleDocRecordResponse(docData, response);
    } catch (error) {
      this.serverError.emit({ data: error, message: DocumentFormServerErrors.sendData });
      return false;
    }
  }

  handleDocRecordResponse = (docData: EntityDocument, response: any) => {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: DocumentFormServerErrors.sendData });
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
      this.serverError.emit({ data: response.error, message: DocumentFormServerErrors.sendData });
      return false;
    } else {
      this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.documentUpload } });
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
    const docArray = Object.values(this.documentData).flat();
    if (!docArray.length) { return; }

    const documentRecords = docArray.map(docData => this.createDocumentRecord(docData));
    const recordsCreated = await Promise.all(documentRecords);
    if (!recordsCreated) { return; }

    const uploads = docArray.map(docData => this.uploadDocument(docData));
    const uploadsCompleted = await Promise.all(uploads);
    if (!uploadsCompleted) { return; }

    uploadsCompleted && this.formLoading.emit(false);
    await onSuccess();
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
      return <justifi-skeleton variant='rounded' height={'350px'} />;
    }

    return <justifi-business-documents-on-file documents={this.documents} />;
  }

  get formInputs() {
    if (this.isError) {
      return null;
    }
     if (this.isLoading) {
      return <justifi-skeleton variant='rounded' height={'350px'} />;   
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
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Document Uploads</legend>
            <p>Various file formats such as PDF, DOC, DOCX, JPEG, and others are accepted. Multiple files can be uploaded for each document category.</p>
            <hr />
            {this.documentsOnFile}
            <div class="d-flex flex-column">
              {this.formInputs}
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
