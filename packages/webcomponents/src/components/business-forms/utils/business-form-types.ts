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

// For right now we can use MetaData to track the step that was just completed during a submit event. 
// Eventually we can find other uses for MetaData to present to the implementer. 
interface BusinessFormEventMetaData {
  completedStep?: BusinessFormStep;
}

export enum BusinessFormStep {
  coreInfo = 'coreInfo',
  legalAddress = 'legalAddress',
  additionalQuestions = 'additionalQuestions',
  representative = 'representative',
  owners = 'owners',
  bankAccount = 'bankAccount',
  documentUpload = 'documentUpload',
  termsAndConditions = 'termsAndConditions'
}

export enum BusinessFormServerErrors {
  fetchData = 'Error retrieving business data',
  patchData = 'Error updating business data'
}

export enum BusinessFormClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit'
}

export interface OwnerFormSubmitEvent {
  data: any;
  metadata?: any;
}

export interface OwnerFormClickEvent {
  data?: any;
  name: OwnerFormClickActions;
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

export enum OwnerFormClickActions {
  removeOwner = 'removeOwner',
  addOwner = 'addOwner',
  addOwnerForm = 'addOwnerForm',
  updateOwner = 'updateOwner'
}

export enum DocumentFormServerErrors {
  fetchData = 'Error retrieving document data',
  sendData = 'Error uploading document data'
}

export interface DocumentFormServerErrorEvent {
  data?: any;
  message: DocumentFormServerErrors;
}
