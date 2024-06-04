import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormSubmitEvent, DocumentFormServerErrorEvent, DocumentFormServerErrors } from '../../utils/business-form-types';
import { IBusiness } from '../../../../api/Business';
import Api, { IApiResponse } from '../../../../api/Api';
import { config } from '../../../../../config';
import { documentSchema } from '../../schemas/business-document-upload-schema';
import { FileChangeEvent } from '../../../../components';
import { DocumentUploadData } from '../../../../api/Document';

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
  @State() bankStatementData: any;
  @State() otherData: any;
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

  // It's class related issues that are making the payload empty and causing issues posting to the API. Need to figure out the class logic with methods, etc in order to successfully submit this payload. Think on this. 

  createDocumentRecord = async (docData: DocumentUploadData, onSuccess?: () => void) => {
    this.formLoading.emit(true);
    console.log('docData', docData);
    const payload = docData.record_data;
    try {
      const response = await this.api.post(this.documentEndpoint, JSON.stringify(payload));
      this.handleDocRecordResponse(response, onSuccess);
    } catch (error) {
      this.serverError.emit({ data: error, message: DocumentFormServerErrors.postData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleDocRecordResponse = (response: any, onSuccess: () => void) => {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: DocumentFormServerErrors.postData });
    } else {
      this.otherData.setPresignedUrl(response.data.presigned_url);
      this.uploadDocument(this.otherData, onSuccess);
    }
  }

  // uploadDocument = async (fileData: any, onSuccess?: () => void) => {
  //   const file = fileData.file;
  //   // const 
  //   this.formLoading.emit(true);
  //   try {
  //     const response = await this.api.put(this.documentEndpoint, JSON.stringify(file));
  //     this.handleUploadResponse(response, onSuccess);
  //   } catch (error) {
  //     this.serverError.emit({ data: error, message: DocumentFormServerErrors.postData });
  //   } finally {
  //     this.formLoading.emit(false);
  //   }
  // }

  uploadDocument = async (fileData: DocumentUploadData, onSuccess: () => void) => {
    console.log(onSuccess);
    if (!fileData.presigned_url) {
      throw new Error('Presigned URL is not set');
    }

    const response = await fetch(fileData.presigned_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json' },
      body: JSON.stringify(fileData.file),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  handleFileChange = (e: CustomEvent<FileChangeEvent>) => {
    const docInfo = e.detail;
    const fileData = new DocumentUploadData(docInfo);
    fileData.setRecordData(this.businessId);
    this.holdFileData(fileData);
  }


  holdFileData = (fileData: DocumentUploadData) => {
    console.log('fileData', fileData);
    switch (fileData.document_type) {
      case 'bank_statement':
        this.bankStatementData = fileData;
        break;
      case 'other':
        this.otherData = fileData;
        break;
      default:
        break;
    }
  }
  
  handleUploadResponse(response, onSuccess) {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: DocumentFormServerErrors.postData });
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response, metadata: { completedStep: 'coreInfo' }});
  }



  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.createDocumentRecord(this.otherData, onSuccess));
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
            {/* <div class="col-12">
              <form-control-file
                name="bank_statement"
                label="Bank Statement Upload"
                inputHandler={this.inputHandler}
                error={this.errors?.bank_statement}
                documentType='other'
                onFileChange={this.handleFileChange}
                statusAdornment={'Pending'}
              />
            </div> */}
            <div class="col-12">
              <form-control-file
                name="other"
                label="Other"
                inputHandler={this.inputHandler}
                error={this.errors?.other}
                documentType='other'
                onFileChange={this.handleFileChange}
                statusAdornment={'Pending'}
              />
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }

}