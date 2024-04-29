export interface ICheckout {
  payment_intent_id: string;
  account_id: string;
  platform_account_id: string;
  payment_amount: string;
  payment_client_id: string;
  payment_description: string;
  payment_methods: string[];
  payment_method_group_id: string | null;
  payment_settings: {
    credit_card_payments: boolean;
    ach_payments: boolean;
  };
}