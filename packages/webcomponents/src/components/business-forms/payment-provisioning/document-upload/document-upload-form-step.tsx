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
    this.stepCompleteEvent.emit({ response: null, formStep: BusinessFormStep.documentUpload });
    onSuccess();
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
        this.categories = buildAllCategories(this.country);
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

    const hasUploadedDoc = (categoryValue: string) =>
      this.uploadQueue.some(entry => entry.categoryValue === categoryValue && entry.status === 'uploaded');

    if (!hasUploadedDoc('financial_document') && !hasExistingDoc(financialDocTypes)) {
      errors['financial_document'] = 'Please upload a financial document';
    }

    if (this.country === CountryCode.CAN) {
      const businessDocTypes = ['articles_of_incorporation', 'business_registration'];

      if (!hasUploadedDoc('business_document') && !hasExistingDoc(businessDocTypes)) {
        errors['business_document'] = 'Please upload a business document';
      }

      const requiredCount = this.owners.length;

      const group1Uploaded = this.uploadQueue.filter(
        entry => entry.categoryValue === 'personal_group1' && entry.status === 'uploaded'
      ).length;
      const group1Existing = this.existingDocuments.filter(
        doc => personalDocGroup1Types.has(doc.document_type)
      ).length;
      if (group1Uploaded + group1Existing < requiredCount) {
        errors['personal_group1'] =
          `Please upload ${requiredCount} Group 1 identity document(s) (${group1Uploaded + group1Existing} of ${requiredCount} provided)`;
      }

      const group2Uploaded = this.uploadQueue.filter(
        entry => entry.categoryValue === 'personal_group2' && entry.status === 'uploaded'
      ).length;
      const group2Existing = this.existingDocuments.filter(
        doc => personalDocGroup2Types.has(doc.document_type)
      ).length;
      if (group2Uploaded + group2Existing < requiredCount) {
        errors['personal_group2'] =
          `Please upload ${requiredCount} Group 2 identity document(s) (${group2Uploaded + group2Existing} of ${requiredCount} provided)`;
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

  handleFileSelected = async (e: CustomEvent<FileSelectEvent>) => {
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
      status: 'uploading' as const,
    }));

    const startIndex = this.uploadQueue.length;
    this.uploadQueue = [...this.uploadQueue, ...newEntries];
    this.selectedCategory = '';
    this.selectedDocType = '';
    this.fileInputKey++;

    await Promise.all(newEntries.map(async (entry, i) => {
      const index = startIndex + i;
      try {
        const docData = new EntityDocument(
          { file: entry.file, document_type: entry.docTypeValue as EntityDocumentType },
          this.businessId
        );

        const recordCreated = await this.postDocumentRecordData(docData);
        if (!recordCreated) {
          this.uploadQueue = this.uploadQueue.map((e, j) =>
            j === index ? { ...e, status: 'error' as const } : e
          );
          return;
        }

        const uploaded = await this.uploadDocument(docData);
        this.uploadQueue = this.uploadQueue.map((e, j) =>
          j === index ? { ...e, status: uploaded ? 'uploaded' as const : 'error' as const } : e
        );
      } catch {
        this.uploadQueue = this.uploadQueue.map((e, j) =>
          j === index ? { ...e, status: 'error' as const } : e
        );
      }
    }));
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

        {this.country === CountryCode.CAN && this.owners.length > 0 && (
          <div class="alert alert-info mt-3">
            One document from each group (Group 1 and Group 2) is required for each owner ({this.owners.length} owner(s)).
          </div>
        )}

        <fieldset class="mt-4">
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Add Document</legend>
            <form-control-tooltip helpText="Upload documents one at a time. Select the category and type, then choose a file. For Canadian businesses, one Group 1 and one Group 2 identity document is required for each owner." />
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
