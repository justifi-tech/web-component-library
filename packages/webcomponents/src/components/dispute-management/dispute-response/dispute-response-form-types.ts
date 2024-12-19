export interface DisputeResponseFormSubmitEvent {
  data?: any;
  metadata?: any;
}

export interface DisputeResponseFormStepCompletedEvent {
  data: any;
  formStep: DisputeResponseFormStep;
  metadata?: any;
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