import { createStore } from '@stencil/store';
import { PaymentsParams } from '../../api';

const initialState = {};

const paymentsListQueryParams = createStore<PaymentsParams>(() => initialState);
const { state: queryParams, on: onQueryParamsChange } = paymentsListQueryParams;

const clearParams = () => {
  paymentsListQueryParams.reset();
}

export {
  paymentsListQueryParams,
  queryParams,
  onQueryParamsChange,
  clearParams
};
