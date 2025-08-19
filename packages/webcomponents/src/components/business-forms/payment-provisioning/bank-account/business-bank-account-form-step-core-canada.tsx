import { Component, h, Prop, State, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { businessBankAccountSchemaCanada } from '../../schemas/business-bank-account-schema-canada';
import { FormController } from '../../../../ui-components/form/form';
import { BusinessFormStep } from '../../utils';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import {
  BankAccount,
  IBankAccount,
  EntityDocument,
  EntityDocumentStorage,
  FileSelectEvent,
  ComponentErrorEvent,
  ComponentFormStepCompleteEvent,
  ComponentErrorCodes,
  ComponentErrorSeverity,
} from '../../../../api';

@Component({
  tag: 'justifi-business-bank-account-form-step-core-canada',
})
export class BusinessBankAccountFormStepCoreCanada {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() bankAccount: IBankAccount = {};
  @State() existingDocuments: any = [];
  @State() documentData: EntityDocumentStorage = new EntityDocumentStorage();
  @State() isLoading: boolean = false;

  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() postBankAccount: Function;
  @Prop() postDocumentRecord: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading event
  @Event() formLoading: EventEmitter<boolean>;

  @Watch('isLoading')
  watchHandler(newValue: boolean) {
    this.formLoading.emit(newValue);
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    if (this.existingBankAccount) {
      this.sendData(onSuccess);
    } else {
      this.formController.validateAndSubmit(() => this.sendData(onSuccess));
    }
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(businessBankAccountSchemaCanada(this.existingDocuments, this.allowOptionalFields));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  initializeFormController = () => {
    this.formController = new FormController(businessBankAccountSchemaCanada(this.existingDocuments, this.allowOptionalFields));
    this.formController.setInitialValues({ ...this.bankAccount });
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
    // Canada EFT routing number format: 0 + institution_number(3) + transit_number(5)
    const values = this.formController.values.getValue();
    const routing_number = `0${(values.institution_number || '').toString()}${(values.transit_number || '').toString()}`;
    const payload = new BankAccount({
      ...values,
      routing_number,
      business_id: this.businessId,
    }).payload;
    return payload;
  }

  get existingBankAccount() {
    return !!this.bankAccount?.id;
  }

  private getData = () => {
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        if (response.data.bank_accounts.length > 0) {
          this.bankAccount = new BankAccount(response.data.bank_accounts[0]);
        } else {
          this.bankAccount = new BankAccount({});
          this.bankAccount.business_id = this.businessId;
        }
        this.existingDocuments = response.data.documents;
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
      const bankAccountPosted = !this.existingBankAccount ? await this.postBankAccountData() : true;
      if (!bankAccountPosted) {
        return;
      }

      const documentsUploaded = await this.postBusinessDocuments();
      if (!documentsUploaded) {
        return;
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

  private async postBusinessDocuments(): Promise<boolean> {
    this.isLoading = true;
    try {
      const docArray = Object.values(this.documentData).flat();
      if (!docArray.length) {
        return true;
      }

      const recordsCreated = await Promise.all(
        docArray.map((docData) => this.postDocumentRecordData(docData))
      );

      if (recordsCreated.includes(false)) {
        return false;
      }

      const uploadsCompleted = await Promise.all(
        docArray.map((docData) => this.uploadDocument(docData))
      );

      if (uploadsCompleted.includes(false)) {
        return false;
      }

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

  render() {
    const bankAccountDefaultValue = this.formController.getInitialValues();

    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset class="mb-4">
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Bank Account Info</legend>
            <form-control-tooltip helpText="This direct deposit account is the designated bank account where incoming funds will be deposited. The name of this account must match the registered business name exactly." />
          </div>
          <hr class="mt-2" />
          <bank-account-form-inputs-canada
            defaultValue={bankAccountDefaultValue}
            errors={this.errors}
            inputHandler={this.inputHandler}
            formDisabled={this.existingBankAccount}
          />
        </fieldset>
        <fieldset class="mt-4">
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Document Uploads</legend>
            <form-control-tooltip helpText="One document (voided check or bank statement) is required for underwriting purposes. It needs to visibly show the name tied to the account and the account number." />
          </div>
          <hr class="mt-2" />
          <business-documents-on-file documents={this.existingDocuments} isLoading={this.isLoading} />
          <bank-account-document-form-inputs
            inputHandler={this.inputHandler}
            errors={this.errors}
            storeFiles={this.storeFiles}
          />
        </fieldset>
      </form>
    );
  }
}


