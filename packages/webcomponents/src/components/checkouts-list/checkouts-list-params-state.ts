import { createStore } from '@stencil/store';
import { CheckoutsQueryParams } from '../../api';

const initialState = {};

const checkoutsListQueryParams = createStore<CheckoutsQueryParams>(() => initialState);
const { state: queryParams, on: onQueryParamsChange } = checkoutsListQueryParams;

const clearParams = () => {
  checkoutsListQueryParams.reset();
}

export {
  checkoutsListQueryParams,
  queryParams,
  onQueryParamsChange,
  clearParams
};
