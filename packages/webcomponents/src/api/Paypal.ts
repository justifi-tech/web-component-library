export type PaypalFundingSource = 'paypal' | 'venmo';

export interface IPaypalOrder {
  id: string;
  checkout_id: string;
  funding_source: PaypalFundingSource;
  provider_order_id: string;
  status?: string;
  payer_action_url?: string | null;
  amount?: number;
  currency?: string;
}
