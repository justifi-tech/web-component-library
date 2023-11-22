interface PaymentMethodCreateResponseWrapper {
  id: string;
  type: 'payment_method';
  page_info: string;
  error?: string;
}

interface ServerError extends PaymentMethodCreateResponseWrapper {
  exception: string;
  status: number;
  traces: {
    applicationTrace: Array<any>;
    frameworkTrace: Array<any>;
    fullTrace: Array<any>;
  };
}

interface CardCreateResponse extends PaymentMethodCreateResponseWrapper {
  data?: {
    signature: string;
    customer_id: string;
    account_id: string;
    card: {
      id: string;
      name: string;
      acct_last_four: number;
      brand: string;
      token: string;
      month: string;
      year: string;
      metadata: any;
      address_line1_check: string;
      address_postal_code_check: string;
    };
  };
}

interface BankAccountCreateResponse extends PaymentMethodCreateResponseWrapper {
  data?: {
    signature: string;
    customer_id: string;
    account_id: string;
    bank_account: {
      id: string;
      account_owner_name: string;
      account_type: 'checking' | 'savings';
      bank_name: string;
      acct_last_four: number;
      token: string;
      metadata: any;
    };
  };
}

export type CreatePaymentMethodResponse =
  | CardCreateResponse
  | BankAccountCreateResponse
  | ServerError;
