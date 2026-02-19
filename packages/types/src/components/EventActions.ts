export enum BusinessFormClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit',
  removeOwner = 'removeOwner',
  addOwner = 'addOwner',
  addOwnerForm = 'addOwnerForm',
  updateOwner = 'updateOwner',
}

export enum BusinessFormStep {
  businessInfo = 'business_info',
  legalAddress = 'legal_address',
  additionalQuestions = 'additional_questions',
  representative = 'representative',
  owners = 'owners',
  bankAccount = 'bank_account',
  documentUpload = 'document_upload',
  termsAndConditions = 'terms_and_conditions',
}

export enum DisputeManagementClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  cancelDispute = 'cancelDispute',
  respondToDispute = 'respondToDispute',
  submit = 'submit',
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

export enum TableClickActions {
  row = 'tableRow',
  next = 'nextPage',
  previous = 'previousPage',
}
