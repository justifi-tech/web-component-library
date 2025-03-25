export enum RefundStatuses {
  succeeded = 'succeeded',
  failed = 'failed'
}

export enum RefundReasons {
  customerRequest = 'customer_request',
  duplicate = 'duplicate',
  fraudulent = 'fraudulent'
}

export interface RefundPayload {
  amount: number;
  reason: RefundReasons;
  description?: string;
  metadata?: any;
}

export interface IRefund {
  amount: number;
  created_at: string;
  description: string;
  id: string;
  metadata: object | null;
  payment_id: string;
  reason: RefundReasons | null;
  status: RefundStatuses;
  updated_at: string;
}

export class Refund implements IRefund {
  public amount: number;
  public created_at: string;
  public description: string;
  public id: string;
  public metadata: object | null;
  public payment_id: string;
  public reason: RefundReasons | null;
  public status: RefundStatuses;
  public updated_at: string;

  constructor(refund: Refund) {
    this.amount = refund.amount;
    this.created_at = refund.created_at;
    this.description = refund.description;
    this.id = refund.id;
    this.metadata = refund.metadata;
    this.payment_id = refund.payment_id;
    this.reason = refund.reason;
    this.status = refund.status;
    this.updated_at = refund.updated_at;
  }

  public get payload(): RefundPayload {
    return {
      amount: this.amount,
      reason: this.reason,
      description: this.description,
      metadata: this.metadata,
    };
  }
}
