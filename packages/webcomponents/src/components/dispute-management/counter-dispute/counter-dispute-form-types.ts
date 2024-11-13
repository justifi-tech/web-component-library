export interface CounterDisputeFormSubmitEvent {
  data?: any;
  metadata?: any;
}

export interface CounterDisputeFormStepCompletedEvent {
  data: any;
  formStep: CounterDisputeFormStep;
  metadata?: any;
}

export enum CounterDisputeFormStep {
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