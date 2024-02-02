interface PageInfo {
  has_previous: boolean;
  has_next: boolean;
  start_cursor: string;
  end_cursor: string;
}

interface Card {
  id: string;
  acct_last_four: string;
  brand: string;
  name: string;
  token: string;
  metadata: null;
  created_at: string;
  updated_at: string;
}

interface BankAccount {
  id: string;
  acct_last_four: string;
  name: string;
  brand: string;
  token: string;
  created_at: string;
  updated_at: string;
}

interface PaymentMethod {
  card?: Card;
  bank_account?: BankAccount;
  customer_id: string;
  signature: string;
}

interface ApplicationFee {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  description: string | null;
  reason: string | null;
  status: string;
  metadata: null;
  created_at: string;
  updated_at: string;
}

interface DataItem {
  id: string;
  account_id: string;
  amount_disputed: number;
  amount_refunded: number;
  amount_returned: number;
  amount: number;
  amount_refundable: number;
  application_fee_rate_id: string | null;
  balance: number;
  capture_strategy: string;
  captured: boolean;
  created_at: string;
  currency: string;
  description: string;
  statement_descriptor: string;
  disputed: boolean;
  error_code: string | null;
  error_description: string | null;
  fee_amount: number;
  financial_transaction_id: string;
  is_test: boolean;
  metadata: null;
  payment_intent_id: string | null;
  refunded: boolean;
  returned: boolean;
  status: string;
  updated_at: string;
  payment_method: PaymentMethod;
  application_fee: ApplicationFee;
  refunds: Refund[];
  disputes: any[];
  transaction_hold: null;
}

export interface FetchPaymentsResponseType {
  id: string | null;
  type: string;
  page_info: PageInfo;
  data: DataItem[];
}
