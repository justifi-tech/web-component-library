import { createStore } from '@stencil/store';
import { PayoutsQueryParams } from '../../api';

const initialState = {};

const payoutsListQueryParams = createStore<PayoutsQueryParams>(() => initialState);
const { state: queryParams, on: onQueryParamsChange } = payoutsListQueryParams;

const clearParams = () => {
  payoutsListQueryParams.reset();
}

export {
  payoutsListQueryParams,
  queryParams,
  onQueryParamsChange,
  clearParams
};
