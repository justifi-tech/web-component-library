export interface PaymentMethodPayload {
  token?: string;
  bnpl?: {
    order_uuid: string;
    status: string;
    session_uuid: string;
  }
}