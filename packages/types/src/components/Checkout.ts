import { CheckoutCardBrand } from '../entities/Checkout';

export enum PAYMENT_MODE {
  ECOM = 'ecom',
  BNPL = 'bnpl',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum PAYMENT_METHODS {
  SAVED_CARD = 'saved_card',
  NEW_CARD = 'new_card',
  SAVED_BANK_ACCOUNT = 'saved_bank_account',
  NEW_BANK_ACCOUNT = 'new_bank_account',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEZZLE = 'sezzle',
  PLAID = 'plaid',
}

export type SelectedPaymentMethod = { id?: string; type: PAYMENT_METHODS };

export type SavedPaymentMethod = {
  id: string;
  type: PAYMENT_METHODS;
  status: string;
  invalid_reason: null;
  name: string;
  brand: CheckoutCardBrand;
  acct_last_four: string;
  account_type: string;
  month: string;
  year: string;
  address_line1_check: string;
  address_postal_code_check: string;
  bin_details: null;
};

export type Hook<T = any> = (
  data: T,
  resolve: (data: T) => void,
  reject: () => void,
) => void;

export interface CheckoutState {
  selectedPaymentMethod: SelectedPaymentMethod | undefined;
  paymentAmount: number;
  totalAmount: number;
  paymentCurrency: string;
  paymentDescription: string;
  savedPaymentMethods: SavedPaymentMethod[];
  savePaymentMethod: boolean;
  bnplEnabled: boolean;
  applePayEnabled: boolean;
  insuranceEnabled: boolean;
  disableBankAccount: boolean;
  disableCreditCard: boolean;
  disablePaymentMethodGroup: boolean;
  paymentToken?: string;
}

export interface CheckoutChangedEventDetail {
  availablePaymentMethodTypes: PAYMENT_METHODS[];
  selectedPaymentMethod: SelectedPaymentMethod | undefined;
  savedPaymentMethods: SavedPaymentMethod[];
}
