export interface BusinessFormSubmitEvent {
  data?: any;
  metadata?: any;
}

export interface BusinessFormClickEvent {
  data?: any;
  name: BusinessFormClickActions;
}


export interface BusinessFormStepCompletedEvent {
  data: any;
  formStep: BusinessFormStep;
  metadata?: any;
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
