import { createStore } from '@stencil/store';
import { ICheckoutPaymentMethod, PaymentMethodTypes } from '../api';
import { BillingFormFields } from '../components';
import { PAYMENT_METHODS } from '../components/modular-checkout/ModularCheckout';

interface IInitialState {
  accountId: string;
  authToken: string;
  billingFormFields: BillingFormFields;
  bnplEnabled: boolean;
  insuranceEnabled: boolean;
  bnplProviderApiVersion: string;
  bnplProviderCheckoutUrl: string;
  bnplProviderClientId: string;
  bnplProviderMode: string;
  checkoutId: string;
  checkoutLoaded: boolean;
  bankAccountVerification?: boolean;
  disableBankAccount: boolean;
  disableBnpl: boolean;
  disableCreditCard: boolean;
  disablePaymentMethodGroup: boolean;
  paymentAmount: number;
  paymentCurrency: string;
  paymentDescription: string;
  paymentMethodGroupId: string | undefined;
  paymentMethods: ICheckoutPaymentMethod[];
  paymentToken?: string;
  savePaymentMethod: boolean;
  selectedPaymentMethod: ICheckoutPaymentMethod | { type: PaymentMethodTypes };
  totalAmount: number;
  plaidPublicToken?: string;
  plaidLinkTokenId?: string;
}

const initialState: IInitialState = {
  accountId: '',
  authToken: '',
  billingFormFields: {
    address_postal_code: '',
  },
  bnplEnabled: false,
  insuranceEnabled: false,
  bnplProviderApiVersion: '',
  bnplProviderCheckoutUrl: '',
  bnplProviderClientId: '',
  bnplProviderMode: '',
  checkoutId: '',
  checkoutLoaded: false,
  bankAccountVerification: undefined,
  disableBankAccount: false,
  disableBnpl: false,
  disableCreditCard: false,
  disablePaymentMethodGroup: false,
  paymentAmount: 0,
  paymentCurrency: 'USD',
  paymentDescription: '',
  paymentMethodGroupId: undefined,
  paymentMethods: [],
  paymentToken: undefined,
  savePaymentMethod: false,
  selectedPaymentMethod: { type: PaymentMethodTypes.card },
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
      (pm) => pm.type === 'card'
    );
    const hasSavedBank = checkoutStore.paymentMethods.some(
      (pm) => pm.type === 'bank_account'
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

  if (checkoutStore.bnplEnabled && !checkoutStore.disableBnpl) {
    methods.push(PAYMENT_METHODS.SEZZLE);
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
  return checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.card;
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
