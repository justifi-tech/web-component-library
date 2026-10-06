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
