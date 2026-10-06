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
  metadata: any;
  created_at: string;
  updated_at: string;
  dispute_response?: IDisputeResponse;
}

export class Dispute implements IDispute {
  public id: string;
  public amount: number;
  public currency: string;
  public payment_id: string;
  public reason: string;
  public due_date: string;
  public status: DisputeStatus;
  public metadata: any;
  public created_at: string;
  public updated_at: string;
  public dispute_response?: DisputeResponse;

  get needsResponse() {
    return this.status == DisputeStatus.needsResponse
  }

  get underReview() {
    return this.status == DisputeStatus.underReview
  }

  get won() {
    return this.status == DisputeStatus.won
  }

  get lost() {
    return this.status == DisputeStatus.lost
  }

  constructor(dispute: IDispute) {
    this.id = dispute.id;
    this.amount = dispute.amount;
    this.currency = dispute.currency;
    this.payment_id = dispute.payment_id;
    this.reason = dispute.reason;
    this.due_date = dispute.due_date;
    this.status = dispute.status;
    this.metadata = dispute.metadata;
    this.created_at = dispute.created_at;
    this.updated_at = dispute.updated_at;
    this.dispute_response = dispute.dispute_response ? new DisputeResponse(dispute.dispute_response) : undefined;
  }
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

export class DisputeResponse implements IDisputeResponse {
  public additional_statement: string;
  public cancellation_policy_disclosure: string;
  public cancellation_rebuttal: string;
  public customer_billing_address: string;
  public customer_email_address: string;
  public customer_name: string;
  public customer_purchase_ip_address: string;
  public duplicate_charge_explanation: string;
  public product_description: string;
  public refund_policy_disclosure: string;
  public refund_refusal_explanation: string;
  public service_date: string;
  public shipping_address: string;
  public shipping_carrier: string;
  public shipping_date: string;
  public shipping_tracking_number: string;
  public duplicate_charge_original_payment_id: string;

  constructor(response: IDisputeResponse) {
    this.additional_statement = response.additional_statement;
    this.cancellation_policy_disclosure = response.cancellation_policy_disclosure;
    this.cancellation_rebuttal = response.cancellation_rebuttal;
    this.customer_billing_address = response.customer_billing_address;
    this.customer_email_address = response.customer_email_address;
    this.customer_name = response.customer_name;
    this.customer_purchase_ip_address = response.customer_purchase_ip_address;
    this.duplicate_charge_explanation = response.duplicate_charge_explanation;
    this.product_description = response.product_description;
    this.refund_policy_disclosure = response.refund_policy_disclosure;
    this.refund_refusal_explanation = response.refund_refusal_explanation;
    this.service_date = response.service_date;
    this.shipping_address = response.shipping_address;
    this.shipping_carrier = response.shipping_carrier;
    this.shipping_date = response.shipping_date;
    this.shipping_tracking_number = response.shipping_tracking_number;
    this.duplicate_charge_original_payment_id = response.duplicate_charge_original_payment_id;
  }
}
