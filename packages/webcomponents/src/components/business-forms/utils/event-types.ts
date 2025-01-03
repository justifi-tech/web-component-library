export enum BusinessFormClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit',
  removeOwner = 'removeOwner',
  addOwner = 'addOwner',
  addOwnerForm = 'addOwnerForm',
  updateOwner = 'updateOwner'
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
