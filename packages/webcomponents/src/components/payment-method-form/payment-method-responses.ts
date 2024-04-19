interface PaymentMethodCreateResponseWrapper {
  id: string;
  type: "payment_method";
  error?: {
    code: string;
    message: string;
  };
  page_info: string;
}

export interface CardCreateResponse extends PaymentMethodCreateResponseWrapper {
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
      bin_details?: {
        type: "Credit" | "Debit" | "Prepaid" | "Unknown";
        card_brand: string;
        card_class: string;
        country: string;
        issuer: string;
        funding_source:
        | "Charge"
        | "Credit"
        | "Debit"
        | "Deferred Debit (Visa Only)"
        | "Network Only"
        | "Prepaid";
      };
    };
  };
}

export interface BankAccountCreateResponse extends PaymentMethodCreateResponseWrapper {
  data?: {
    signature: string;
    customer_id: string;
    account_id: string;
    bank_account: {
      id: string;
      account_owner_name: string;
      account_type: "checking" | "savings";
      bank_name: string;
      acct_last_four: number;
      token: string;
      metadata: any;
    };
  };
}

export type CreatePaymentMethodResponse =
  | CardCreateResponse
  | BankAccountCreateResponse;
