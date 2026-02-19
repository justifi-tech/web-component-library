export enum RefundStatuses {
  succeeded = 'succeeded',
  failed = 'failed',
}

export enum RefundReasons {
  customerRequest = 'customer_request',
  duplicate = 'duplicate',
  fraudulent = 'fraudulent',
}

export interface IRefundPayload {
  amount?: number;
  reason?: RefundReasons;
  description?: string;
  metadata?: unknown;
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
