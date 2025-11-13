import { Component, h, Prop, State, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { bankAccountSchemaByCountry } from '../../schemas/business-bank-account-schema';
import { CountryCode } from '../../../../utils/country-codes';
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
import { PlaidService } from '../../../../api/services/plaid.service';
import plaidLogoSvg from '../../../../assets/plaid-icon.svg';

@Component({
  tag: 'justifi-business-bank-account-form-step-core',
})
export class BusinessBankAccountFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() bankAccount: IBankAccount = {};
  @State() existingDocuments: any = [];
  @State() documentData: EntityDocumentStorage = new EntityDocumentStorage();
  @State() isLoading: boolean = false;
  @State() isPlaidAuthenticating: boolean = false;
  @State() plaidPublicToken: string | null = null;
  @State() plaidLinkToken: string | null = null;
  @State() plaidLink: any = null;
  @State() plaidError: string | null = null;
  @State() accountId: string = '';
  
  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() postBankAccount: Function;
  @Prop() postDocumentRecord: Function;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country: CountryCode;
  @Prop() authToken: string;

  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading event
  @Event() formLoading: EventEmitter<boolean>;

  private scriptRef: HTMLScriptElement;
  private plaidService = new PlaidService();
  private abortController: AbortController | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  @Watch('isLoading')
  watchHandler(newValue: boolean) {
    this.formLoading.emit(newValue);
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    if (this.existingBankAccount) {
      // If a bank account already exists, skip bank account posting; proceed directly to document upload
      this.sendData(onSuccess);
    } else {
      // If bank account is new, validate form inputs (bank account fields), then proceed
      this.formController.validateAndSubmit(() => this.sendData(onSuccess));
    }
  }

  private getSchema = () => {
    const schema = bankAccountSchemaByCountry[this.country];
    return schema(this.allowOptionalFields, this.existingDocuments);
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(this.getSchema());
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  componentDidRender() {
    if (this.scriptRef) {
      this.scriptRef.onload = () => {
        if (this.authToken && !this.existingBankAccount) {
          this.initializePlaidLink();
        }
      };
      this.scriptRef.onerror = () => {
        this.plaidError = 'Unable to load Plaid. Please refresh the page and try again.';
        this.errorEvent.emit({
          message: this.plaidError,
          errorCode: ComponentErrorCodes.POST_ERROR,
          severity: ComponentErrorSeverity.ERROR
        });
      };
    }
  }

  disconnectedCallback() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  initializeFormController = () => {
    this.formController = new FormController(this.getSchema());
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
    const values = this.formController.values.getValue();
    const formValues = new BankAccount(values).payload;
    return formValues;
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
        this.accountId = response.data.platform_account_id;
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
        // Initialize Plaid after data is loaded, if no existing bank account
        if (this.authToken && !this.existingBankAccount) {
          this.loadPlaidScript();
        }
      }
    });
  }

  private async sendData(onSuccess: () => void) {
    try {
      //  Post bank account data if the form is not disabled
      const bankAccountPosted = !this.existingBankAccount ? await this.postBankAccountData() : true;
      if (!bankAccountPosted) {
        return;
      }
  
      // Post documents only after bank account was successfully created
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

  loadPlaidScript = () => {
    // Check if script is already loaded
    if (typeof (window as any).Plaid !== 'undefined') {
      this.initializePlaidLink();
      return;
    }

    // Create and append script if not exists
    const existingScript = document.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      script.async = true;
      script.onload = () => {
        if (this.authToken && !this.existingBankAccount) {
          this.initializePlaidLink();
        }
      };
      script.onerror = () => {
        this.plaidError = 'Unable to load Plaid. Please refresh the page and try again.';
        this.errorEvent.emit({
          message: this.plaidError,
          errorCode: ComponentErrorCodes.POST_ERROR,
          severity: ComponentErrorSeverity.ERROR
        });
      };
      document.head.appendChild(script);
      this.scriptRef = script;
    } else {
      // Script already exists, wait for it to load
      if (typeof (window as any).Plaid !== 'undefined') {
        this.initializePlaidLink();
      } else {
        (existingScript as HTMLScriptElement).onload = () => {
          this.initializePlaidLink();
        };
      }
    }
  }

  initializePlaidLink = async () => {
    try {
      if (typeof (window as any).Plaid === 'undefined') {
        this.plaidError = 'Plaid SDK not loaded. Please refresh the page and try again.';
        this.errorEvent.emit({
          message: this.plaidError,
          errorCode: ComponentErrorCodes.POST_ERROR,
          severity: ComponentErrorSeverity.ERROR
        });
        return;
      }

      await this.getLinkToken();

      if (!this.plaidLinkToken) {
        return;
      }

      const Plaid = (window as any).Plaid;
      this.plaidLink = Plaid.create({
        token: this.plaidLinkToken,
        onSuccess: this.handlePlaidSuccess,
        onExit: this.handlePlaidExit,
        onEvent: this.handlePlaidEvent,
        onLoad: this.handlePlaidLoad,
      });
    } catch (error) {
      this.plaidError = 'Unable to initialize bank connection. Please try again.';
      this.errorEvent.emit({
        message: this.plaidError,
        errorCode: ComponentErrorCodes.POST_ERROR,
        severity: ComponentErrorSeverity.ERROR,
        data: error
      });
    }
  }

  getLinkToken = async () => {
    try {
      if (!this.authToken) {
        this.plaidError = 'Missing authentication. Please refresh the page and try again.';
        this.errorEvent.emit({
          message: this.plaidError,
          errorCode: ComponentErrorCodes.MISSING_PROPS,
          severity: ComponentErrorSeverity.ERROR
        });
        return;
      }

      const accountId = this.accountId || this.businessId;
      
      // Create abort controller for timeout handling
      this.abortController = new AbortController();

      // Set timeout for the request
      this.timeoutId = setTimeout(() => {
        this.abortController?.abort();
      }, 30000); // 30 second timeout

      // For business forms, we use businessId as checkoutId equivalent
      const response = await this.plaidService.getLinkToken(
        this.authToken,
        accountId,
        this.businessId, // Using businessId as checkoutId for business forms
        this.abortController.signal
      );

      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (response.error) {
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : response.error.message || 'Failed to get link token';
        throw new Error(errorMessage);
      }

      this.plaidLinkToken = response.data.link_token;
      this.plaidError = null;
    } catch (error) {
      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (error.name === 'AbortError') {
        this.plaidError = 'Request timed out. Please try again.';
      } else {
        this.plaidError = error.message || 'Failed to connect to bank service. Please try again.';
      }
      
      this.errorEvent.emit({
        message: this.plaidError,
        errorCode: ComponentErrorCodes.POST_ERROR,
        severity: ComponentErrorSeverity.ERROR,
        data: error
      });
    }
  }

  openPlaidLink = () => {
    if (this.plaidLink && this.plaidLinkToken) {
      this.isPlaidAuthenticating = true;
      this.plaidError = null;
      this.plaidLink.open();
    }
  }

  handlePlaidSuccess = async (publicToken: string, _metadata: any) => {
    this.plaidPublicToken = publicToken;
    this.isPlaidAuthenticating = false;
    this.plaidError = null;

    try {
      // Exchange public token for bank account details
      const accountId = this.accountId || this.businessId;
      const response = await this.plaidService.tokenizeBankAccount(
        this.authToken,
        accountId,
        publicToken
      );

      if (response.error) {
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : response.error.message || 'Failed to retrieve bank account details';
        throw new Error(errorMessage);
      }

      // Extract bank account data from response
      const bankAccountData = response.data?.bank_account || response.data;
      
      if (bankAccountData) {
        // Populate form with Plaid data
        const plaidFormData: any = {};
        
        if (bankAccountData.account_owner_name) {
          plaidFormData.account_owner_name = bankAccountData.account_owner_name;
        }
        if (bankAccountData.bank_name) {
          plaidFormData.bank_name = bankAccountData.bank_name;
        }
        if (bankAccountData.account_type) {
          plaidFormData.account_type = bankAccountData.account_type;
        }
        if (bankAccountData.routing_number) {
          plaidFormData.routing_number = bankAccountData.routing_number;
        }
        // Note: Account number is typically not returned for security, but last 4 digits might be
        if (bankAccountData.acct_last_four || bankAccountData.account_number_last4) {
          plaidFormData.acct_last_four = bankAccountData.acct_last_four || bankAccountData.account_number_last4;
        }

        // Update form controller with Plaid data
        const currentValues = this.formController.values.getValue();
        this.formController.setValues({
          ...currentValues,
          ...plaidFormData
        });

        // Update bankAccount state
        this.bankAccount = {
          ...this.bankAccount,
          ...plaidFormData
        };
      }
    } catch (error) {
      this.plaidError = error.message || 'Failed to retrieve bank account details. Please try again.';
      this.errorEvent.emit({
        message: this.plaidError,
        errorCode: ComponentErrorCodes.POST_ERROR,
        severity: ComponentErrorSeverity.ERROR,
        data: error
      });
    }
  }

  handlePlaidExit = (err: any, _metadata: any) => {
    this.isPlaidAuthenticating = false;

    if (err) {
      this.plaidError = err.error_message || 'Bank connection failed. Please try again.';
      this.errorEvent.emit({
        message: this.plaidError,
        errorCode: ComponentErrorCodes.POST_ERROR,
        severity: ComponentErrorSeverity.ERROR,
        data: err
      });
    }
  }

  handlePlaidEvent = (eventName: string, metadata: any) => {
    switch (eventName) {
      case 'OPEN':
        this.isPlaidAuthenticating = true;
        break;
      case 'CLOSE':
        this.isPlaidAuthenticating = false;
        break;
      case 'ERROR':
        this.plaidError = metadata.error_message || 'An error occurred during bank connection.';
        this.errorEvent.emit({
          message: this.plaidError,
          errorCode: ComponentErrorCodes.POST_ERROR,
          severity: ComponentErrorSeverity.ERROR,
          data: metadata
        });
        this.isPlaidAuthenticating = false;
        break;
    }
  }

  handlePlaidLoad = () => {
    // Plaid Link loaded successfully
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
            <form-control-tooltip helpText="This direct deposit account is the designated bank account where incoming funds will be deposited. The name of this account must match the registered business name exactly. We are not able to accept personal accounts unless your business is a registered sole proprietorship." />
          </div>
          <hr class="mt-2" />
          {!this.existingBankAccount && this.authToken && (
            <div class="mb-3">
              <button
                type="button"
                class="btn btn-outline-primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (this.plaidLink && this.plaidLinkToken) {
                    this.openPlaidLink();
                  } else if (!this.plaidLinkToken) {
                    // Try to initialize if not already done
                    this.loadPlaidScript();
                  }
                }}
                disabled={this.isPlaidAuthenticating || !this.plaidLink || !this.plaidLinkToken}
              >
                {this.isPlaidAuthenticating ? (
                  'Connecting...'
                ) : (
                  <span>
                    Connect with Plaid
                    <img
                      src={plaidLogoSvg}
                      alt="Plaid"
                      style={{
                        display: 'inline',
                        width: '20px',
                        height: '20px',
                        marginLeft: '5px',
                        verticalAlign: 'middle',
                      }}
                    />
                  </span>
                )}
              </button>
              {this.plaidPublicToken && (
                <div class="text-success mt-2">
                  <small>✓ Bank account connected successfully</small>
                </div>
              )}
              {this.plaidError && (
                <div class="text-danger mt-2">
                  <small>{this.plaidError} dasd</small>
                </div>
              )}
              {this.plaidLinkToken && !this.plaidPublicToken && !this.plaidError && (
                <div class="text-muted mt-2">
                  <small>Click to connect your bank account</small>
                </div>
              )}
            </div>
          )}
          {this.country === CountryCode.CAN ? (
            <bank-account-form-inputs-canada
              defaultValue={bankAccountDefaultValue}
              errors={this.errors}
              inputHandler={this.inputHandler}
              formDisabled={this.existingBankAccount}
            />
          ) : (
            <bank-account-form-inputs
              defaultValue={bankAccountDefaultValue}
              errors={this.errors}
              inputHandler={this.inputHandler}
              formDisabled={this.existingBankAccount}
            />
          )}
        </fieldset>
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
      </form>
    );
  }
}

