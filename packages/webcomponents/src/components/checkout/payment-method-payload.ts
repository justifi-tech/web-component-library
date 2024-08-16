
export interface PaymentMethodPayload {
  token?: string;
  bnpl?: {
    order_uuid: string;
    status: string;
    session_uuid: string;
  },
  error?: {
    code: string;
    message: string;
    decline_code: string;
  },
  validationError?: boolean;
}