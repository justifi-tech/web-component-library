import { PaymentMethodPayload } from "../checkout/payment-method-payload";

export interface TokenizePaymentMethodSubmitEvent {
  response: PaymentMethodPayload;
}
