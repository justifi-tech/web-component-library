import { createStore } from '@stencil/store';
import { ICheckoutPaymentMethod } from '../api';

interface IInitialState {
  authToken: string;
  accountId: string;
  paymentMethods: ICheckoutPaymentMethod[];
  paymentMethodGroupId: string;
  paymentDescription: string;
  totalAmount: number;
  paymentAmount: number;
  selectedPaymentMethod: string;
  checkoutId: string;
  bnplEnabled: boolean;
  bnplProviderClientId: string;
  bnplProviderMode: string;
  bnplProviderApiVersion: string;
  bnplProviderCheckoutUrl: string;
  disableCreditCard: boolean;
  disableBankAccount: boolean;
  disableBnpl: boolean;
}

const initialState: IInitialState = {
  authToken: '',
  accountId: '',
  paymentMethods: [],
  paymentMethodGroupId: '',
  paymentDescription: '',
  totalAmount: 0,
  paymentAmount: 0,
  selectedPaymentMethod: '',
  checkoutId: '',
  bnplEnabled: false,
  bnplProviderClientId: '',
  bnplProviderMode: '',
  bnplProviderApiVersion: '',
  bnplProviderCheckoutUrl: '',
  disableCreditCard: false,
  disableBankAccount: false,
  disableBnpl: false,
};

const { state, onChange } = createStore(initialState);

Object.keys(initialState).forEach((key) => {
  // @ts-ignore
  onChange(key, (newValue) => {
    state[key] = newValue;
  });
});

export default state;
