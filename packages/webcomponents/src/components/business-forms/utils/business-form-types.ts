export interface BusinessFormSubmitEvent {
  data?: any;
  metadata?: BusinessFormEventMetaData;
}

export interface BusinessFormClickEvent {
  data?: any;
  name: BusinessFormClickActions;
}

export interface BusinessFormServerErrorEvent {
  data?: any;
  message: BusinessFormServerErrors;
}

export interface BusinessFormStepCompletedEvent {
  data: any;
  formStep: BusinessFormStepV2;
}

// For right now we can use MetaData to track the step that was just completed during a submit event. 
// Eventually we can find other uses for MetaData to present to the implementer. 
interface BusinessFormEventMetaData {
  completedStep?: BusinessFormStep;
  ownerID?: string; 
}

export enum BusinessFormStep {
  coreInfo = 'coreInfo',
  legalAddress = 'legal_address',
  additionalQuestions = 'additional_questions',
  representative = 'representative',
  owners = 'owners',
  bankAccount = 'bankAccount',
  documentUpload = 'documentUpload',
  termsAndConditions = 'termsAndConditions'
}

export enum BusinessFormStepV2 {
  businessInfo = 'business_info',
  legalAddress = 'legal_address',
  additionalQuestions = 'additional_questions',
  representative = 'representative',
  owners = 'owners',
  bankAccount = 'bank_account',
  documentUpload = 'document_upload',
  termsAndConditions = 'terms_and_conditions'
}

export enum BusinessFormServerErrors {
  fetchData = 'Error retrieving business data',
  patchData = 'Error updating business data'
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

export interface OwnerFormSubmitEvent {
  data: any;
  metadata?: any;
}


export interface OwnerFormServerErrorEvent {
  data?: any;
  message: OwnerFormServerErrors;
}

export enum OwnerFormServerErrors {
  fetchData = 'Error retrieving owner data',
  patchData = 'Error updating owner data',
  postData = 'Error adding owner data'
}

export enum DocumentFormServerErrors {
  fetchData = 'Error retrieving document data',
  sendData = 'Error uploading document data'
}

export interface DocumentFormServerErrorEvent {
  data?: any;
  message: DocumentFormServerErrors;
}
