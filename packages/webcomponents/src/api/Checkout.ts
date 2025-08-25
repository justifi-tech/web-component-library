import { IApiResponse } from './Api';
import { CurrencyTypes } from './Payment';
import { formatCurrency } from '../utils/utils';

export interface IBnpl {
  provider: string;
  provider_client_id: string;
  provider_mode: string;
  provider_checkout_url: string;
  provider_order_id: string;
  provider_api_version: string;
}

interface ICompletion {
  payment_mode?: ICheckoutPaymentMode;
  payment_token?: string | null;
  payment_status?: string | null;
  payment_response?: any;
  payment_error_code?: string | null;
  payment_error_description?: string | null;
  checkout_id?: string;
  additional_transactions?: any[];
  payment_id?: string;
  payment_method_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export class Completion implements ICompletion {
  payment_mode?: ICheckoutPaymentMode;
  payment_token?: string | null;
  payment_status?: string | null;
  payment_response?: any;
  payment_error_code?: string | null;
  payment_error_description?: string | null;
  checkout_id?: string;
  additional_transactions?: any[];
  payment_id?: string;
  payment_method_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;

  constructor(data: ICompletion) {
    this.payment_mode = ICheckoutPaymentMode[data.payment_mode];
    this.payment_token = data.payment_token;
    this.payment_status = data.payment_status;
    this.payment_response = data.payment_response;
    this.payment_error_code = data.payment_error_code;
    this.payment_error_description = data.payment_error_description;
    this.checkout_id = data.checkout_id;
    this.additional_transactions = data.additional_transactions;
    this.payment_id = data.payment_id;
    this.payment_method_id = data.payment_method_id;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export interface ICheckout {
  id: string;
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
    insurance_payments: boolean;
  };
  bnpl?: IBnpl;
  total_amount: number;
  insurance_amount: number;
  status: ICheckoutStatus;
  payment_currency?: CurrencyTypes;
  mode?: string | null;
  statement_descriptor?: string | null;
  application_fees?: any[] | null;
  successful_payment_id?: string | null;
  created_at: string;
  updated_at: string;
  completions?: ICompletion[];
}

export class Checkout implements ICheckout {
  id: string;
  description: string;
  payment_intent_id: string;
  account_id: string;
  platform_account_id: string;
  payment_amount: number;
  payment_client_id: string;
  payment_description: string;
  payment_methods: ICheckoutPaymentMethod[];
  payment_method_group_id: string;
  payment_settings: {
    ach_payments: boolean;
    bnpl_payments: boolean;
    credit_card_payments: boolean;
    insurance_payments: boolean;
  };
  bnpl?: IBnpl;
  total_amount: number;
  insurance_amount: number;
  status: ICheckoutStatus;
  payment_currency?: CurrencyTypes;
  mode?: string | null;
  statement_descriptor?: string | null;
  application_fees?: any[] | null;
  successful_payment_id?: string | null;
  created_at: string;
  updated_at: string;
  completions?: ICompletion[];
  sub_account_name?: string;

  constructor(data: ICheckout) {
    this.id = data.id;
    this.description = data.description;
    this.payment_intent_id = data.payment_intent_id;
    this.account_id = data.account_id;
    this.platform_account_id = data.platform_account_id;
    this.payment_amount = data.payment_amount;
    this.payment_client_id = data.payment_client_id;
    this.payment_description = data.payment_description;
    this.payment_methods = data.payment_methods;
    this.payment_method_group_id = data.payment_method_group_id;
    this.payment_settings = data.payment_settings;
    this.bnpl = data.bnpl;
    this.total_amount = data.total_amount;
    this.insurance_amount = data.insurance_amount;
    this.status = ICheckoutStatus[data.status];
    this.payment_currency = data.payment_currency;
    this.mode = data.mode;
    this.statement_descriptor = data.statement_descriptor;
    this.application_fees = data.application_fees;
    this.successful_payment_id = data.successful_payment_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.completions = data.completions?.map(
      (completion) => new Completion(completion)
    );
  }

  get payment_mode(): ICheckoutPaymentMode {
    let paymentMode: ICheckoutPaymentMode;

    if (!this.completions || this.completions.length === 0) {
      return ICheckoutPaymentMode.unknown;
    }

    const sortedCompletions = this.completions.sort((a, b) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    const lastCompletion = sortedCompletions[0];

    if (lastCompletion.payment_mode) {
      paymentMode = lastCompletion.payment_mode;
    } else if (lastCompletion.payment_response?.data?.payment_method?.card) {
      paymentMode = ICheckoutPaymentMode.card;
    } else if (
      lastCompletion.payment_response?.data?.payment_method?.bank_account
    ) {
      paymentMode = ICheckoutPaymentMode.bank_account;
    }

    return paymentMode;
  }

  formattedPaymentAmount(amount: number): string {
    return formatCurrency(amount, this.payment_currency);
  }
}

export enum ICheckoutPaymentMode {
  bnpl = 'Buy Now Pay Later',
  ecom = 'E-commerce',
  card = 'Card',
  bank_account = 'Bank Account',
  card_present = 'Card Present',
  unknown = '',
}

export enum ICheckoutPaymentModeParam {
  bnpl = 'bnpl',
  ecom = 'ecom',
}

export enum ICheckoutStatus {
  created = 'created',
  completed = 'completed',
  attempted = 'attempted',
  expired = 'expired',
}

export enum CompletionStatuses {
  failed = 'failed',
  succeeded = 'succeeded',
}

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

export interface CheckoutsQueryParams {
  status?: ICheckoutStatus;
  payment_mode?: ICheckoutPaymentMode;
}

export interface ICheckoutPaymentMethod {
  id: string;
  type?: string;
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
}
