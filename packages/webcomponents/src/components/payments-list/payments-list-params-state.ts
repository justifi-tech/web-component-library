import { createStore } from '@stencil/store';
import { PaymentsParams } from '../../api';

const paymentsListParamsStore = createStore<PaymentsParams>({});
const { state: paymentsListParams, on: onPaymentsParamsChange } = paymentsListParamsStore;

const clearParams = () => {
  Object.keys(paymentsListParams).forEach((key) => {
    paymentsListParams[key] = '';
  });
}

export {
  paymentsListParamsStore,
  paymentsListParams,
  onPaymentsParamsChange,
  clearParams
};
