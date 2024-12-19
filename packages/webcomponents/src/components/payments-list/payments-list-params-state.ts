import { createStore } from '@stencil/store';
import { PaymentsQueryParams } from '../../api';

const initialState = {};

const paymentsListQueryParams = createStore<PaymentsQueryParams>(() => initialState);
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
