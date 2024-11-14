import { IApiResponse } from './Api';

export interface IBnpl {
  provider: string;
  provider_client_id: string;
  provider_mode: string;
  provider_checkout_url: string;
  provider_order_id: string;
  provider_api_version: string;
}

export interface ICheckout {
  id: string;
  created_at: string;
  description: string;
  payment_intent_id: string;
  account_id: string;
  platform_account_id: string;
  payment_amount: number;
  payment_client_id: string;
  payment_description: string;
  payment_methods: {
    id: string;
    status: string;
    invalid_reason: null;
    name: string;
    brand: string;
    acct_last_four: string;
    month: string;
    year: string;
    address_line1_check: string;
    address_postal_code_check: string;
    bin_details: null;
  }[];
  payment_method_group_id: string;
  payment_settings: {
    ach_payments: boolean;
    bnpl_payments: boolean;
    credit_card_payments: boolean;
  };
  bnpl?: IBnpl;
  total_amount: number;
  insurance_amount: number;
  status: ICheckoutStatus;
}

export class Checkout implements ICheckout {
  id: string;
  created_at: string;
  description: string;
  payment_intent_id: string;
  account_id: string;
  platform_account_id: string;
  payment_amount: number;
  payment_client_id: string;
  payment_description: string;
  payment_methods: {
    id: string;
    status: string;
    invalid_reason: null;
    name: string;
    brand: string;
    acct_last_four: string;
    month: string;
    year: string;
    address_line1_check: string;
    address_postal_code_check: string;
    bin_details: null;
  }[];
  payment_method_group_id: string;
  payment_settings: {
    ach_payments: boolean;
    bnpl_payments: boolean;
    credit_card_payments: boolean;
  };
  bnpl?: IBnpl;
  total_amount: number;
  insurance_amount: number;
  status: ICheckoutStatus;

  constructor(data: ICheckout) {
    Object.assign(this, data);
  }
}

export type ICheckoutPaymentMode = 'ecom' | 'bnpl';

export type ICheckoutStatus = 'created' | 'completed' | 'attempted' | 'expired';

export type ICheckoutCompleteResponse = IApiResponse<{
  payment_mode: ICheckoutPaymentMode;
  payment_token: null;
  payment_status: string;
  payment_response: null;
  checkout_id: string;
  additional_transactions: any[];
  checkout: ICheckout;
}>;

export type ILoadedEventResponse = {
  checkout_status: ICheckoutStatus;
};

export interface ICheckoutsParams {
  status?: ICheckoutStatus;
  payment_mode?: ICheckoutPaymentMode;
}