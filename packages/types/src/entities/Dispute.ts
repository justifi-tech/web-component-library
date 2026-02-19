export enum DisputeStatus {
  won = 'won',
  lost = 'lost',
  underReview = 'under_review',
  needsResponse = 'needs_response',
}

export interface IDispute {
  id: string;
  amount: number;
  currency: string;
  payment_id: string;
  reason: string;
  due_date: string;
  status: DisputeStatus;
  metadata: unknown;
  created_at: string;
  updated_at: string;
  dispute_response?: IDisputeResponse;
}

export interface IDisputeResponse {
  additional_statement: string;
  cancellation_policy_disclosure: string;
  cancellation_rebuttal: string;
  customer_billing_address: string;
  customer_email_address: string;
  customer_name: string;
  customer_purchase_ip_address: string;
  duplicate_charge_explanation: string;
  product_description: string;
  refund_policy_disclosure: string;
  refund_refusal_explanation: string;
  service_date: string;
  shipping_address: string;
  shipping_carrier: string;
  shipping_date: string;
  shipping_tracking_number: string;
  duplicate_charge_original_payment_id: string;
}
