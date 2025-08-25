import { createStore } from '@stencil/store';
import { ICheckoutPaymentMethod } from '../api';
import { BillingFormFields } from '../components';

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
  disableBankAccount: boolean;
  disableBnpl: boolean;
  disableCreditCard: boolean;
  disablePaymentMethodGroup: boolean;
  paymentAmount: number;
  paymentDescription: string;
  paymentMethodGroupId: string | undefined;
  paymentMethods: ICheckoutPaymentMethod[];
  paymentToken?: string;
  savePaymentMethod: boolean;
  selectedPaymentMethod: string;
  totalAmount: number;
}

const initialState: IInitialState = {
  accountId: '',
  authToken: '',
  billingFormFields: {
    address_postal_code: '',
  },
  bnplEnabled: false,
  insuranceEnabled: undefined,
  bnplProviderApiVersion: '',
  bnplProviderCheckoutUrl: '',
  bnplProviderClientId: '',
  bnplProviderMode: '',
  checkoutId: '',
  disableBankAccount: false,
  disableBnpl: false,
  disableCreditCard: false,
  disablePaymentMethodGroup: false,
  paymentAmount: 0,
  paymentDescription: '',
  paymentMethodGroupId: undefined,
  paymentMethods: [],
  paymentToken: undefined,
  savePaymentMethod: false,
  selectedPaymentMethod: '',
  totalAmount: 0,
};

const { state: checkoutStore, onChange } = createStore(initialState);

Object.keys(initialState).forEach((key) => {
  // @ts-ignore
  onChange(key, (newValue) => {
    checkoutStore[key] = newValue;
  });
});

export { checkoutStore, onChange };
