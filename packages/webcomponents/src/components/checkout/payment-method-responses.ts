interface CreatedCard {
  id: string;
  name: string;
  acct_last_four: string;
  brand: string;
  token: string;
  month: string;
  year: string;
  metadata: any;
  address_line1_check: string;
  address_postal_code_check: string;
  bin_details?: {
    type: 'Credit' | 'Debit' | 'Prepaid' | 'Unknown';
    card_brand: string;
    card_class: string;
    country: string;
    issuer: string;
    funding_source:
    | 'Charge'
    | 'Credit'
    | 'Debit'
    | 'Deferred Debit (Visa Only)'
    | 'Network Only'
    | 'Prepaid';
  };
};

interface CreatedBankAccount {
  id: string;
  account_owner_name: string;
  account_type: 'checking' | 'savings';
  bank_name: string;
  acct_last_four: string;
  token: string;
  metadata: any;
};

export interface CreatePaymentMethodResponse {
  id: string;
  type: 'payment_method';
  error?: {
    code: string;
    message: string;
    decline_code: string;
  };
  data?: {
    signature: string;
    customer_id: string;
    account_id: string;
    invalid_reason: string;
    status: "valid" | 'invalid';
    card?: CreatedCard;
    bank_account?: CreatedBankAccount;
  }
  page_info?: string;
};
