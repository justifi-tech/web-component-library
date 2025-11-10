import { createStore } from '@stencil/store';
import { BillingFormFields } from '../components';
import {
  PAYMENT_METHODS,
  SavedPaymentMethod,
  SelectedPaymentMethod,
} from '../components/modular-checkout/ModularCheckout';

interface IInitialState {
  accountId: string;
  authToken: string;
  billingFormFields: BillingFormFields;
  bnplEnabled: boolean;
  applePayEnabled: boolean;
  googlePayEnabled: boolean;
  insuranceEnabled: boolean;
  bnplProviderApiVersion: string;
  bnplProviderCheckoutUrl: string;
  bnplProviderClientId: string;
  bnplProviderMode: string;
  checkoutId: string;
  checkoutLoaded: boolean;
  bankAccountVerification?: boolean;
  disableBankAccount: boolean;
  disableCreditCard: boolean;
  disablePaymentMethodGroup: boolean;
  paymentAmount: number;
  paymentCurrency: string;
  paymentDescription: string;
  paymentMethodGroupId: string | undefined;
  paymentMethods: SavedPaymentMethod[];
  paymentToken?: string;
  savePaymentMethod: boolean;
  selectedPaymentMethod: SelectedPaymentMethod | undefined;
  totalAmount: number;
  plaidPublicToken?: string;
  plaidLinkTokenId?: string;
}

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

const initialState: IInitialState = {
  accountId: '',
  authToken: '',
  billingFormFields: {
    address_postal_code: '',
  },
  bnplEnabled: false,
  applePayEnabled: false,
  googlePayEnabled: false,
  insuranceEnabled: false,
  bnplProviderApiVersion: '',
  bnplProviderCheckoutUrl: '',
  bnplProviderClientId: '',
  bnplProviderMode: '',
  checkoutId: '',
  checkoutLoaded: false,
  bankAccountVerification: undefined,
  disableBankAccount: false,
  disableCreditCard: false,
  disablePaymentMethodGroup: false,
  paymentAmount: 0,
  paymentCurrency: 'USD',
  paymentDescription: '',
  paymentMethodGroupId: undefined,
  paymentMethods: [],
  paymentToken: undefined,
  savePaymentMethod: false,
  selectedPaymentMethod: undefined,
  totalAmount: 0,
  plaidPublicToken: undefined,
  plaidLinkTokenId: undefined,
};

const { state: checkoutStore, onChange } = createStore(initialState);

Object.keys(initialState).forEach((key) => {
  // @ts-ignore
  onChange(key, (newValue) => {
    checkoutStore[key] = newValue;
  });
});

// Helper: compute available payment methods based on store flags
export function getAvailablePaymentMethodTypes(): PAYMENT_METHODS[] {
  const methods: PAYMENT_METHODS[] = [];

  if (
    !checkoutStore.disablePaymentMethodGroup &&
    checkoutStore.paymentMethods?.length
  ) {
    const hasSavedCard = checkoutStore.paymentMethods.some(
      (pm) => pm.type === PAYMENT_METHODS.SAVED_CARD
    );
    const hasSavedBank = checkoutStore.paymentMethods.some(
      (pm) => pm.type === PAYMENT_METHODS.SAVED_BANK_ACCOUNT
    );

    if (hasSavedCard && !checkoutStore.disableCreditCard) {
      methods.push(PAYMENT_METHODS.SAVED_CARD);
    }
    if (hasSavedBank && !checkoutStore.disableBankAccount) {
      methods.push(PAYMENT_METHODS.SAVED_BANK_ACCOUNT);
    }
  }

  if (!checkoutStore.disableCreditCard) {
    methods.push(PAYMENT_METHODS.NEW_CARD);
  }

  if (!checkoutStore.disableBankAccount) {
    methods.push(PAYMENT_METHODS.NEW_BANK_ACCOUNT);
  }

  if (checkoutStore.bnplEnabled) {
    methods.push(PAYMENT_METHODS.SEZZLE);
  }

  if (checkoutStore.applePayEnabled) {
    methods.push(PAYMENT_METHODS.APPLE_PAY);
  }

  if (checkoutStore.googlePayEnabled) {
    methods.push(PAYMENT_METHODS.GOOGLE_PAY);
  }

  if (
    checkoutStore.bankAccountVerification === true &&
    !checkoutStore.disableBankAccount
  ) {
    methods.push(PAYMENT_METHODS.PLAID);
  }

  return methods;
}

export function isNewCardSelected(): boolean {
  return checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.NEW_CARD;
}

export function getCheckoutState(): CheckoutState {
  return {
    selectedPaymentMethod: checkoutStore.selectedPaymentMethod,
    paymentAmount: checkoutStore.paymentAmount,
    totalAmount: checkoutStore.totalAmount,
    paymentCurrency: checkoutStore.paymentCurrency,
    paymentDescription: checkoutStore.paymentDescription,
    savedPaymentMethods: checkoutStore.paymentMethods,
    savePaymentMethod: checkoutStore.savePaymentMethod,
    bnplEnabled: checkoutStore.bnplEnabled,
    applePayEnabled: checkoutStore.applePayEnabled,
    insuranceEnabled: checkoutStore.insuranceEnabled,
    disableBankAccount: checkoutStore.disableBankAccount,
    disableCreditCard: checkoutStore.disableCreditCard,
    disablePaymentMethodGroup: checkoutStore.disablePaymentMethodGroup,
    paymentToken: checkoutStore.paymentToken ?? undefined,
  };
}

export { checkoutStore as checkoutStore, onChange };

// Subscribe to all store key changes with a single helper
// The callback is invoked for every key defined in the initial state whenever it changes.
type StoreKey = keyof typeof initialState;
export function onAnyChange(
  callback: (key: StoreKey, value: (typeof initialState)[StoreKey]) => void
): void {
  (Object.keys(initialState) as StoreKey[]).forEach((key) => {
    // @ts-ignore - onChange is generically typed by stencil/store but not exported here
    onChange(key as any, (newValue: any) => callback(key, newValue));
  });
}
