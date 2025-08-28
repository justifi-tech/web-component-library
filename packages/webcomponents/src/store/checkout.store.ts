import { createStore } from '@stencil/store';
import { ICheckoutPaymentMethod } from '../api';
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
  selectedPaymentMethod: PAYMENT_METHODS;
  totalAmount: number;
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
  selectedPaymentMethod: PAYMENT_METHODS.NEW_CARD,
  totalAmount: 0,
};

const { state: checkoutStore, onChange } = createStore(initialState);

Object.keys(initialState).forEach((key) => {
  // @ts-ignore
  onChange(key, (newValue) => {
    checkoutStore[key] = newValue;
  });
});

// Computed: available payment methods based on store flags
Object.defineProperty(checkoutStore, 'availablePaymentMethods', {
  get() {
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
  },
});

type CheckoutStoreWithComputed = typeof checkoutStore & {
  readonly availablePaymentMethods: PAYMENT_METHODS[];
};

const checkoutStoreTyped = checkoutStore as CheckoutStoreWithComputed;

export { checkoutStoreTyped as checkoutStore, onChange };
