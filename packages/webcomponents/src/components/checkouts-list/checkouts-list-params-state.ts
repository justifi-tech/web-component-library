import { createStore } from '@stencil/store';
import { ICheckoutsParams } from '../../api';

const initialState = {};

const checkoutsListQueryParams = createStore<ICheckoutsParams>(() => initialState);
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
