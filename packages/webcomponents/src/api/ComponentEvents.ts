
// click-event

export interface ClickEvent {
  name: BusinessFormClickActions | DisputeManagementClickActions | TableRowClickActions; // The action that was clicked
  data?: any;
}

export enum BusinessFormClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit',
  removeOwner = 'removeOwner',
  addOwner = 'addOwner',
  addOwnerForm = 'addOwnerForm',
  updateOwner = 'updateOwner'
}

export enum DisputeManagementClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  cancelDispute = 'cancelDispute',
  respondToDispute = 'respondToDispute',
  submit = 'submit',
}

export enum TableRowClickActions {
  payment = 'paymentTableRow',
  payout = 'payoutTableRow',
  checkout = 'checkoutTableRow',
  terminal = 'terminalTableRow'
}

// submit-event

export interface SubmitEvent {
  data?: any;
  metadata?: any;
}

// complete-form-step-event

export interface CompleteFormStepEvent {
  formStep: BusinessFormStep | DisputeResponseFormStep; // The form step that was completed
  data: any; // The data that was submitted, if any, for the form step
  metadata?: any; // Optional additional info about the form step completion
}

export enum BusinessFormStep {
  businessInfo = 'business_info',
  legalAddress = 'legal_address',
  additionalQuestions = 'additional_questions',
  representative = 'representative',
  owners = 'owners',
  bankAccount = 'bank_account',
  documentUpload = 'document_upload',
  termsAndConditions = 'terms_and_conditions'
}

export enum DisputeResponseFormStep {
  disputeReason = 'dispute_reason',
  productOrService = 'product_or_service',
  customerDetails = 'customer_details',
  cancellationPolicy = 'cancellation_policy',
  refundPolicy = 'refund_policy',
  duplicateCharge = 'duplicate_charge',
  electronicEvidence = 'electronic_evidence',
  shippingDetails = 'shipping_details',
  additionalStatement = 'additional_statement',
}

// error-event

export interface ErrorEvent {
  errorCode: ComponentErrorCodes; // A unique code identifying the error
  message: string; // A descriptive message about the error
  severity?: ComponentErrorSeverity; // Optional severity level
  data?: any; // Additional data pertinent to the error (optional)
}

export enum ComponentErrorCodes {
  MISSING_PROPS = 'missing-props',
  FETCH_ERROR = 'fetch-error',
  PATCH_ERROR = 'patch-error',
  POST_ERROR = 'post-error',
  UNKNOWN_ERROR = 'unknown-error',
  TOKENIZE_ERROR = 'tokenize-error',
  NOT_AUTHENTICATED = 'not-authenticated',
  INVALID_PARAMETER = 'invalid-parameter',
  PROVISIONING_REQUESTED = 'provisioning-already-requested',
}

export enum ComponentErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}
