import { Component, h, Prop, State, Event, EventEmitter, Watch, Method } from '@stencil/core';
import { ComponentErrorEvent, ComponentErrorCodes, ComponentErrorSeverity, ComponentFormStepCompleteEvent, BankAccount, IBankAccount, EntityDocument, EntityDocumentStorage, FileSelectEvent } from '../../../../api';
import { makeGetBusiness, makePostBankAccount, makePostDocumentRecord } from '../payment-provisioning-actions';
import { BusinessService, BusinessBankAccountService, DocumentRecordService } from '../../../../api/services/business.service';
import { CountryCode } from '../../../../utils/country-codes';
import { bankAccountSchemaByCountry } from '../../schemas/business-bank-account-schema';
import { FormController } from '../../../../ui-components/form/form';
import { BusinessFormStep } from '../../utils';
import { heading2, buttonSecondary, buttonLink } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { Button } from '../../../../ui-components';

@Component({
  tag: 'justifi-business-bank-account-form-step'
})
export class BusinessBankAccountFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() bankAccount: IBankAccount = {};
  @State() existingDocuments: any = [];
  @State() documentData: EntityDocumentStorage = new EntityDocumentStorage();
  @State() isLoading: boolean = false;
  @State() viewMode: 'readonly' | 'plaid' | 'manual' = 'manual';
  @State() getBusiness: Function;
  @State() postBankAccount: Function;
  @State() postDocumentRecord: Function;
  @State() postDocument: Function;
  @State() bankAccountVerification: boolean = false;
  @State() platformAccountId: string | null = null;

  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country!: CountryCode;

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
    if (this.viewMode === 'readonly') {
      this.sendData(onSuccess);
    } else {
      this.formController.validateAndSubmit(() => this.sendData(onSuccess));
    }
  }

  componentWillLoad() {
    this.initializeApi();
    if (this.getBusiness) {
      this.getData();
    }
    this.formController = new FormController(this.getSchema());
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.postBankAccount = makePostBankAccount({
        authToken: this.authToken,
        service: new BusinessBankAccountService()
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

  private getSchema = () => {
    const schema = bankAccountSchemaByCountry[this.country];
    return schema(this.allowOptionalFields, this.existingDocuments);
  }

  initializeFormController = () => {
    this.formController = new FormController(this.getSchema());
    if (this.viewMode === 'readonly') {
      this.formController.setInitialValues({ ...this.bankAccount });
    } else {
      this.formController.setInitialValues({ business_id: this.businessId });
    }
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  storeFiles = (e: CustomEvent<FileSelectEvent>) => {
    const fileList = Array.from(e.detail.fileList) as File[];
    const docType = e.detail.document_type;
    const documentList = fileList.map(file => new EntityDocument({ file, document_type: docType }, this.businessId));
    this.documentData[docType] = documentList;
  }

  get postPayload() {
    const values = this.formController.values.getValue();
    const formValues = new BankAccount(values).payload;
    return formValues;
  }

  get existingBankAccount() {
    return !!this.bankAccount?.id;
  }

  get plaidAvailable() {
    return this.bankAccountVerification && !!this.platformAccountId;
  }

  get showCancel() {
    return this.bankAccountVerification || this.existingBankAccount;
  }

  private processBusinessResponse(data: any) {
    const { bank_accounts, documents, settings, platform_account_id } = data;
    if (bank_accounts.length > 0) {
      this.bankAccount = new BankAccount(bank_accounts[bank_accounts.length - 1]);
    } else {
      this.bankAccount = new BankAccount({});
      this.bankAccount.business_id = this.businessId;
    }
    this.existingDocuments = documents;
    this.bankAccountVerification = settings.bank_account_verification === true;
    this.platformAccountId = platform_account_id;
  }

  private determineViewMode() {
    if (this.existingBankAccount) {
      this.viewMode = 'readonly';
    } else if (this.plaidAvailable) {
      this.viewMode = 'plaid';
    } else {
      this.viewMode = 'manual';
    }
  }

  private getData = () => {
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        this.processBusinessResponse(response.data);
        this.determineViewMode();
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.initializeFormController();
        this.isLoading = false;
      }
    });
  }

  private async sendData(onSuccess: () => void) {
    try {
      if (this.viewMode === 'manual') {
        const bankAccountPosted = await this.postBankAccountData();
        if (!bankAccountPosted) return;
      }

      const documentsUploaded = await this.postBusinessDocuments();
      if (!documentsUploaded) return;

      if (this.viewMode === 'manual') {
        this.viewMode = 'readonly';
        await this.refreshBankAccountData();
      }

      onSuccess();
    } catch (error) {
      this.errorEvent.emit({
        message: error,
        errorCode: ComponentErrorCodes.POST_ERROR,
        severity: ComponentErrorSeverity.ERROR
      });
    }
  }

  private async postBankAccountData(): Promise<boolean> {
    let submittedData;
    this.isLoading = true;
    return new Promise((resolve) => {
      let success = false;
      this.postBankAccount({
        payload: this.postPayload,
        onSuccess: (response) => {
          submittedData = response;
          success = true;
        },
        onError: ({ error, code, severity }) => {
          success = false;
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity
          });
        },
        final: () => {
          this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.bankAccount });
          this.isLoading = false;
          resolve(success);
        }
      });
    });
  }

  private async refreshBankAccountData(): Promise<void> {
    return new Promise((resolve) => {
      this.isLoading = true;
      this.getBusiness({
        onSuccess: (response) => {
          this.processBusinessResponse(response.data);
          this.determineViewMode();
          this.initializeFormController();
        },
        onError: ({ error, code, severity }) => {
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity
          });
        },
        final: () => {
          this.isLoading = false;
          resolve();
        }
      });
    });
  }

  handleChangeBankAccount = () => {
    this.viewMode = this.plaidAvailable ? 'plaid' : 'manual';
    this.documentData = new EntityDocumentStorage();
    this.initializeFormController();
  }

  handleCancel = () => {
    this.viewMode = this.existingBankAccount ? 'readonly' : 'plaid';
    this.documentData = new EntityDocumentStorage();
    this.initializeFormController();
  }

  handleToggleToManualEntry = () => {
    this.viewMode = 'manual';
  }

  handleToggleToPlaidVerification = () => {
    this.viewMode = 'plaid';
  }

  handleSaveBankAccount = async () => {
    this.formController.validateAndSubmit(() => {
      this.sendData(() => {
        // Success callback - form will refresh automatically
      });
    });
  }

  private async postBusinessDocuments(): Promise<boolean> {
    this.isLoading = true;
    try {
      const docArray = Object.values(this.documentData).flat();
      if (!docArray.length) {
        return true;
      }

      const recordsCreated = await Promise.all(
        docArray.map((docData) => this.postDocumentRecordData(docData))
      ); // Create document records

      if (recordsCreated.includes(false)) {
        return false;
      } // Exit if document record creation fails

      const uploadsCompleted = await Promise.all(
        docArray.map((docData) => this.uploadDocument(docData))
      ); // Upload documents to AWS presigned URLs

      if (uploadsCompleted.includes(false)) {
        return false;
      } // Exit if any upload fails

      return true;
    } finally {
      this.isLoading = false;
    }
  }

  private postDocumentRecordData = async (docData: EntityDocument): Promise<boolean> => {
    this.isLoading = true;
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
            severity: severity
          });
          resolve(false);
        },
      });
    });
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

    const fileData = await docData.getFileData();
    const response = await fetch(docData.presigned_url, {
      method: 'PUT',
      body: fileData
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
      return true;
    }
  }

  private renderBankAccountInputs(disabled: boolean) {
    const defaultValue = this.formController.getInitialValues();
    return this.country === CountryCode.CAN ? (
      <bank-account-form-inputs-canada
        defaultValue={defaultValue}
        errors={this.errors}
        inputHandler={this.inputHandler}
        formDisabled={disabled}
      />
    ) : (
      <bank-account-form-inputs
        defaultValue={defaultValue}
        errors={this.errors}
        inputHandler={this.inputHandler}
        formDisabled={disabled}
      />
    );
  }

  private renderReadonlyView() {
    return (
      <div>
        {this.renderBankAccountInputs(true)}
        <div class="mt-3">
          <Button
            variant="secondary"
            type="button"
            onClick={this.handleChangeBankAccount}
            disabled={this.isLoading}
            part={buttonSecondary}
          >
            Change Bank Account
          </Button>
        </div>
      </div>
    );
  }

  private renderPlaidView() {
    return (
      <div class="mt-3">
        <plaid-verification
          authToken={this.authToken}
          accountId={this.platformAccountId}
          businessId={this.businessId}
          onPlaidVerificationSuccess={() => {
            this.viewMode = 'readonly';
            this.refreshBankAccountData();
          }}
        />
        <div class="mt-3">
          <Button
            type="button"
            variant="link"
            className="p-0"
            onClick={this.handleToggleToManualEntry}
            disabled={this.isLoading}
            part={buttonLink}
          >
            Enter bank details manually (document upload required)
          </Button>
        </div>
      </div>
    );
  }

  private renderManualEntryView() {
    return (
      <div>
        {this.plaidAvailable && (
          <div class="mb-3">
            <Button
              type="button"
              variant="secondary"
              onClick={this.handleToggleToPlaidVerification}
              disabled={this.isLoading}
              part={buttonSecondary}
            >
              Link bank account with Plaid instead
            </Button>
          </div>
        )}
        {this.renderBankAccountInputs(false)}
        <div class="mt-3 d-flex gap-2">
          {this.showCancel && (
            <Button
              variant="secondary"
              type="button"
              onClick={this.handleCancel}
              disabled={this.isLoading}
              part={buttonSecondary}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            type="button"
            onClick={this.handleSaveBankAccount}
            disabled={this.isLoading}
            isLoading={this.isLoading}
          >
            Save Bank Account
          </Button>
        </div>
      </div>
    );
  }

  private renderDocumentUploads() {
    return (
      <fieldset class="mt-4">
        <div class="d-flex align-items-center gap-2">
          <legend class="mb-0" part={heading2}>Document Uploads</legend>
          <form-control-tooltip helpText="One document (voided check or bank statement) is required for underwriting purposes. It needs to visibly show the name tied to the account and the account number. Various file formats such as PDF, DOC, DOCX, JPEG are accepted. Multiple files can be uploaded for each document category." />
        </div>
        <hr class="mt-2" />
        <business-documents-on-file documents={this.existingDocuments} isLoading={this.isLoading} />
        <bank-account-document-form-inputs
          inputHandler={this.inputHandler}
          errors={this.errors}
          storeFiles={this.storeFiles}
        />
      </fieldset>
    );
  }

  render() {
    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset class="mb-4">
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Bank Account Info</legend>
            <form-control-tooltip helpText="This direct deposit account is the designated bank account where incoming funds will be deposited. The name of this account must match the registered business name exactly. We are not able to accept personal accounts unless your business is a registered sole proprietorship." />
          </div>
          <hr class="mt-2" />
          {this.viewMode === 'readonly' && this.renderReadonlyView()}
          {this.viewMode === 'plaid' && this.renderPlaidView()}
          {this.viewMode === 'manual' && this.renderManualEntryView()}
        </fieldset>
        {this.viewMode !== 'plaid' && this.renderDocumentUploads()}
      </form>
    );
  }
}
