import { Component, h, Prop, State, Event, EventEmitter, Watch, Method } from '@stencil/core';
import {
  ComponentErrorEvent,
  ComponentErrorCodes,
  ComponentErrorSeverity,
  ComponentFormStepCompleteEvent,
  EntityDocument,
  EntityDocumentType,
  FileSelectEvent,
  IDocument,
  Identity,
} from '../../../../api';
import { makeGetBusiness, makePostDocumentRecord } from '../payment-provisioning-actions';
import { BusinessService, DocumentRecordService } from '../../../../api/services/business.service';
import { CountryCode } from '../../../../utils/country-codes';
import { BusinessFormStep } from '../../utils';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import {
  buildAllCategories,
  DocumentCategory,
  personalDocGroup1Types,
  personalDocGroup2Types,
  UploadedDocumentEntry,
} from './document-upload-options';

@Component({
  tag: 'document-upload-form-step'
})
export class DocumentUploadFormStep {
  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country!: CountryCode;

  @State() owners: Identity[] = [];
  @State() existingDocuments: IDocument[] = [];
  @State() selectedCategory: string = '';
  @State() selectedDocType: string = '';
  @State() uploadQueue: UploadedDocumentEntry[] = [];
  @State() isLoading: boolean = false;
  @State() errors: { [key: string]: string } = {};
  @State() fileInputKey: number = 0;
  @State() getBusiness: Function;
  @State() postDocumentRecord: Function;

  private categories: DocumentCategory[] = [];

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Watch('isLoading')
  watchHandler(newValue: boolean) {
    this.formLoading.emit(newValue);
  }

  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    const validationErrors = this.validate();
    if (Object.keys(validationErrors).length > 0) {
      this.errors = validationErrors;
      return;
    }

    this.errors = {};
    await this.sendData(onSuccess);
  }

  componentWillLoad() {
    this.initializeApi();
    if (this.getBusiness) {
      this.getData();
    }
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.postDocumentRecord = makePostDocumentRecord({
        authToken: this.authToken,
        service: new DocumentRecordService()
      });
    } else {
      this.errorEvent.emit({
        message: 'Missing required props',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private getData = () => {
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        const { owners, documents } = response.data;
        this.owners = owners || [];
        this.existingDocuments = documents || [];
        this.categories = buildAllCategories(this.owners, this.country);
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity,
        });
      },
      final: () => {
        this.isLoading = false;
      }
    });
  }

  private get categoryOptions() {
    return [
      { label: 'Select a category', value: '' },
      ...this.categories.map(c => ({ label: c.label, value: c.value })),
    ];
  }

  private get docTypeOptions() {
    if (!this.selectedCategory) {
      return [{ label: 'Select a category first', value: '' }];
    }
    const category = this.categories.find(c => c.value === this.selectedCategory);
    return category?.docTypeOptions || [{ label: 'Select a category first', value: '' }];
  }

  private validate(): { [key: string]: string } {
    if (this.allowOptionalFields) return {};

    const errors: { [key: string]: string } = {};
    const financialDocTypes = ['voided_check', 'bank_statement'];

    const hasExistingDoc = (types: string[]) =>
      this.existingDocuments.some(doc => types.includes(doc.document_type));

    const hasQueuedDoc = (categoryValue: string) =>
      this.uploadQueue.some(entry => entry.categoryValue === categoryValue);

    if (!hasQueuedDoc('financial_document') && !hasExistingDoc(financialDocTypes)) {
      errors['financial_document'] = 'Please upload a financial document';
    }

    if (this.country === CountryCode.CAN) {
      const businessDocTypes = ['articles_of_incorporation', 'business_registration'];

      if (!hasQueuedDoc('business_document') && !hasExistingDoc(businessDocTypes)) {
        errors['business_document'] = 'Please upload a business document';
      }

      for (const owner of this.owners) {
        const ownerCategoryValue = `personal_${owner.id}`;
        const ownerDocs = this.uploadQueue.filter(
          entry => entry.categoryValue === ownerCategoryValue
        );

        const hasGroup1 = ownerDocs.some(d => personalDocGroup1Types.has(d.docTypeValue));
        const hasGroup2 = ownerDocs.some(d => personalDocGroup2Types.has(d.docTypeValue));

        if (!hasGroup1) {
          errors[`personal_group1_${owner.id}`] =
            `Please upload a Group 1 identity document for ${owner.name}`;
        }
        if (!hasGroup2) {
          errors[`personal_group2_${owner.id}`] =
            `Please upload a Group 2 identity document for ${owner.name}`;
        }
      }
    }

    return errors;
  }

  handleCategoryChange = (_name: string, value: string) => {
    this.selectedCategory = value;
    this.selectedDocType = '';
  }

  handleDocTypeChange = (_name: string, value: string) => {
    if (value.startsWith('_') && value.endsWith('_header')) return;
    this.selectedDocType = value;
  }

  handleFileSelected = (e: CustomEvent<FileSelectEvent>) => {
    const fileList = Array.from(e.detail.fileList) as File[];
    const category = this.categories.find(c => c.value === this.selectedCategory);
    if (!category) return;

    const docTypeOption = category.docTypeOptions.find(o => o.value === this.selectedDocType);
    const docTypeLabel = docTypeOption?.label || this.selectedDocType;

    const newEntries: UploadedDocumentEntry[] = fileList.map(file => ({
      categoryLabel: category.label,
      categoryValue: category.value,
      docTypeLabel,
      docTypeValue: this.selectedDocType,
      fileName: file.name,
      file,
      identityId: category.identityId,
      status: 'pending' as const,
    }));

    this.uploadQueue = [...this.uploadQueue, ...newEntries];
    this.selectedCategory = '';
    this.selectedDocType = '';
    this.fileInputKey++;
  }

  handleRemoveDocument = (index: number) => {
    if (this.uploadQueue[index]?.status === 'uploaded') return;
    this.uploadQueue = this.uploadQueue.filter((_, i) => i !== index);
  }

  handleUploadAll = async () => {
    const indicesToUpload = this.uploadQueue
      .map((e, i) => (e.status === 'pending' || e.status === 'error') ? i : -1)
      .filter(i => i !== -1);

    if (!indicesToUpload.length) return;

    this.uploadQueue = this.uploadQueue.map((e, i) =>
      indicesToUpload.includes(i) ? { ...e, status: 'uploading' as const } : e
    );

    await Promise.all(indicesToUpload.map(async (index) => {
      const entry = this.uploadQueue[index];
      try {
        const docData = new EntityDocument(
          { file: entry.file, document_type: entry.docTypeValue as EntityDocumentType },
          this.businessId,
          entry.identityId
        );

        const recordCreated = await this.postDocumentRecordData(docData);
        if (!recordCreated) {
          this.uploadQueue = this.uploadQueue.map((e, i) =>
            i === index ? { ...e, status: 'error' as const } : e
          );
          return;
        }

        const uploaded = await this.uploadDocument(docData);
        this.uploadQueue = this.uploadQueue.map((e, i) =>
          i === index ? { ...e, status: uploaded ? 'uploaded' as const : 'error' as const } : e
        );
      } catch {
        this.uploadQueue = this.uploadQueue.map((e, i) =>
          i === index ? { ...e, status: 'error' as const } : e
        );
      }
    }));
  }

  private async sendData(onSuccess: () => void) {
    try {
      const documentsUploaded = await this.postBusinessDocuments();
      if (!documentsUploaded) return;

      this.stepCompleteEvent.emit({ response: null, formStep: BusinessFormStep.documentUpload });
      onSuccess();
    } catch (error) {
      this.errorEvent.emit({
        message: error,
        errorCode: ComponentErrorCodes.POST_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private async postBusinessDocuments(): Promise<boolean> {
    this.isLoading = true;
    try {
      const pendingEntries = this.uploadQueue.filter(e => e.status !== 'uploaded');
      const docArray = pendingEntries.map(entry =>
        new EntityDocument(
          { file: entry.file, document_type: entry.docTypeValue as EntityDocumentType },
          this.businessId,
          entry.identityId
        )
      );
      if (!docArray.length) return true;

      const recordsCreated = await Promise.all(
        docArray.map((docData) => this.postDocumentRecordData(docData))
      );
      if (recordsCreated.includes(false)) return false;

      const uploadsCompleted = await Promise.all(
        docArray.map((docData) => this.uploadDocument(docData))
      );
      if (uploadsCompleted.includes(false)) return false;

      return true;
    } finally {
      this.isLoading = false;
    }
  }

  private postDocumentRecordData = async (docData: EntityDocument): Promise<boolean> => {
    const payload = docData.record_data;
    return new Promise((resolve) => {
      this.postDocumentRecord({
        payload,
        onSuccess: (response) => {
          resolve(this.handleDocRecordResponse(docData, response));
        },
        onError: ({ error, code, severity }) => {
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity,
          });
          resolve(false);
        },
      });
    });
  }

  private handleDocRecordResponse = (docData: EntityDocument, response: any) => {
    if (response.error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: response.error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: response.error,
      });
      return false;
    } else {
      docData.setPresignedUrl(response.data.presigned_url);
      return true;
    }
  }

  private uploadDocument = async (docData: EntityDocument) => {
    if (!docData.presigned_url) {
      throw new Error('Presigned URL is not set');
    }

    const fileData = await docData.getFileData();
    const response = await fetch(docData.presigned_url, {
      method: 'PUT',
      body: fileData,
    });

    if (!response.ok) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: 'Failed to upload document',
        severity: ComponentErrorSeverity.ERROR,
      });
      return false;
    }
    return true;
  }

  render() {
    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset>
          <legend class="mb-0" part={heading2}>Document Uploads</legend>
          <hr class="mt-2" />
          <business-documents-on-file
            documents={this.existingDocuments}
            isLoading={this.isLoading}
          />
        </fieldset>

        <fieldset class="mt-4">
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Add Document</legend>
            <form-control-tooltip helpText="Upload documents one at a time. Select the category and type, then choose a file. For identity documents, two documents from different groups are required per owner." />
          </div>
          <hr class="mt-2" />

          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <form-control-select
                name="document_category"
                label="Document Category"
                options={this.categoryOptions}
                defaultValue={this.selectedCategory}
                inputHandler={this.handleCategoryChange}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-select
                name="document_type"
                label="Document Type"
                options={this.docTypeOptions}
                defaultValue={this.selectedDocType}
                inputHandler={this.handleDocTypeChange}
                disabled={!this.selectedCategory}
              />
            </div>
            <div class="col-12">
              <form-control-file
                key={this.fileInputKey}
                name="document_file"
                label="Upload Document"
                documentType={this.selectedDocType as EntityDocumentType}
                onFileSelected={this.handleFileSelected}
                disabled={!this.selectedDocType}
                multiple={false}
              />
            </div>
          </div>
        </fieldset>

        <document-upload-list
          documents={this.uploadQueue}
          removeHandler={this.handleRemoveDocument}
          uploadAllHandler={this.handleUploadAll}
        />

        {Object.keys(this.errors).length > 0 && (
          <div class="alert alert-danger mt-3">
            <ul class="mb-0">
              {Object.values(this.errors).map(err => <li>{err}</li>)}
            </ul>
          </div>
        )}
      </form>
    );
  }
}
