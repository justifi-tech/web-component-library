import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormSubmitEvent, DocumentFormServerErrorEvent, DocumentFormServerErrors } from '../../utils/business-form-types';
import { IBusiness } from '../../../../api/Business';
import Api, { IApiResponse } from '../../../../api/Api';
import { config } from '../../../../../config';
import { documentSchema } from '../../schemas/business-document-upload-schema';
import { FileSelectEvent } from '../../../../components';
import { EntityDocumentType, EntityDocument, EntityDocumentStorage } from '../../../../api/Document';

@Component({
  tag: 'justifi-business-document-upload-form-step',
  styleUrl: 'business-document-upload-form-step.scss',
})
export class BusinessDocumentFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() documents: any;
  @State() documentData: EntityDocumentStorage = new EntityDocumentStorage();
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

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.documents = response.data.documents;
    } catch (error) {
      this.serverError.emit({ data: error, message: DocumentFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  createDocumentRecord = async (docData: EntityDocument) => {
    const payload = docData.record_data;
    try {
      const response = await this.api.post(this.documentEndpoint, JSON.stringify(payload));
      return this.handleDocRecordResponse(docData, response);
    } catch (error) {
      this.serverError.emit({ data: error, message: DocumentFormServerErrors.postData });
      return false;
    }
  }

  handleDocRecordResponse = (docData: EntityDocument,response: any) => {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: DocumentFormServerErrors.postData });
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
    });

    if (!response.ok) {
      return false;
    }

    return response.ok;
  }


  storeFiles = (e: CustomEvent<FileSelectEvent>) => {
    const fileList = Array.from(e.detail.fileList) as File[];
    const docType = e.detail.document_type;
    const documentList = fileList.map(file => new EntityDocument({ file, document_type: docType }, this.businessId));
    this.documentData[docType] = documentList;

    console.log(this.documentData);
  }
  
  handleSubmit = async () => {
    const docArray = Object.values(this.documentData).flat();
    if (!docArray.length) { return; }

    const documentRecords = docArray.map(docData => this.createDocumentRecord(docData));
    const recordsCreated = await Promise.all(documentRecords);
    if (!recordsCreated) { return; }

    const uploads = docArray.map(docData => this.uploadDocument(docData));
    const uploadsCompleted = await Promise.all(uploads);
    if (!uploadsCompleted) { return; }
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.handleSubmit());
    console.log(onSuccess);
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(documentSchema);
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

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Document Uploads</legend>
            <hr />
            <div class="col-12">
              <form-control-file
                name="bank_statement"
                label="Bank Statement Upload"
                inputHandler={this.inputHandler}
                error={this.errors?.bank_statement}
                documentType={EntityDocumentType.bankStatement}
                onFileSelected={this.storeFiles}
                statusAdornment={'Pending'}
                multiple={true}
              />
            </div>
            <div class="col-12">
              <form-control-file
                name="other"
                label="Other"
                inputHandler={this.inputHandler}
                error={this.errors?.other}
                documentType={EntityDocumentType.other}
                onFileSelected={this.storeFiles}
                statusAdornment={'Pending'}
              />
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
