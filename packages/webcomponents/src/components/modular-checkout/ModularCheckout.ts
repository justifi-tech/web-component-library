import { CardBrand, ICheckoutPaymentMethod } from '../../api';

export enum PAYMENT_MODE {
  ECOM = 'ecom',
  BNPL = 'bnpl',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

// Maps the backend payment method types to the frontend payment method types
export enum PAYMENT_METHOD_TYPES {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEZZLE = 'sezzle',
  PLAID = 'plaid',
}

// Available payment methods for the modular checkout component (differentiates between saved and new payment methods)
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
  brand: CardBrand;
  acct_last_four: string;
  account_type: string;
  month: string;
  year: string;
  address_line1_check: string;
  address_postal_code_check: string;
  bin_details: null;
};

const mapPaymentMethodType = (type: PAYMENT_METHOD_TYPES): PAYMENT_METHODS => {
  switch (type) {
    case PAYMENT_METHOD_TYPES.CARD:
      return PAYMENT_METHODS.SAVED_CARD;
    case PAYMENT_METHOD_TYPES.BANK_ACCOUNT:
      return PAYMENT_METHODS.SAVED_BANK_ACCOUNT;

    default:
      return type as unknown as PAYMENT_METHODS;
  }
};

export class PaymentMethod implements SavedPaymentMethod {
  id: string;
  type: PAYMENT_METHODS;
  status: string;
  invalid_reason: null;
  name: string;
  brand: CardBrand;
  acct_last_four: string;
  account_type: string;
  month: string;
  year: string;
  address_line1_check: string;
  address_postal_code_check: string;
  bin_details: null;

  constructor(paymentMethod: ICheckoutPaymentMethod) {
    this.id = paymentMethod.id;
    this.type = mapPaymentMethodType(paymentMethod.type);
    this.status = paymentMethod.status;
    this.invalid_reason = paymentMethod.invalid_reason;
    this.name = paymentMethod.name;
    this.brand = paymentMethod.brand as CardBrand;
    this.acct_last_four = paymentMethod.acct_last_four;
    this.account_type = paymentMethod.account_type;
    this.month = paymentMethod.month;
    this.year = paymentMethod.year;
    this.address_line1_check = paymentMethod.address_line1_check;
    this.address_postal_code_check = paymentMethod.address_postal_code_check;
    this.bin_details = paymentMethod.bin_details;
  }
}

// Event detail payload for the checkout-changed event
export interface CheckoutChangedEventDetail {
  availablePaymentMethodTypes: PAYMENT_METHODS[];
  selectedPaymentMethod: SelectedPaymentMethod | undefined;
  savedPaymentMethods: SavedPaymentMethod[];
}
