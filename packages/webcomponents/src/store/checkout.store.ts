import { createStore } from '@stencil/store';
import { ICheckoutPaymentMethod } from '../api';

interface IInitialState {
  authToken: string;
  accountId: string;
  paymentMethods: ICheckoutPaymentMethod[];
  paymentMethodGroupId: string;
  paymentDescription: string;
  paymentCurrency: string;
  totalAmount: number;
  paymentAmount: number;
  selectedPaymentMethod: string;
  checkoutId: string;
  bnplEnabled: boolean;
  bnplProviderClientId: string;
  bnplProviderMode: string;
  bnplProviderApiVersion: string;
  bnplProviderCheckoutUrl: string;
}

const initialState: IInitialState = {
  authToken: '',
  accountId: '',
  paymentMethods: [],
  paymentMethodGroupId: '',
  paymentDescription: '',
  paymentCurrency: 'USD',
  totalAmount: 0,
  paymentAmount: 0,
  selectedPaymentMethod: '',
  checkoutId: '',
  bnplEnabled: false,
  bnplProviderClientId: '',
  bnplProviderMode: '',
  bnplProviderApiVersion: '',
  bnplProviderCheckoutUrl: '',
};

const { state, onChange } = createStore(initialState);

Object.keys(initialState).forEach((key) => {
  // @ts-ignore
  onChange(key, (newValue) => {
    state[key] = newValue;
  });
});

export default state;
