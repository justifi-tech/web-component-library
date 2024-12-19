import { createStore } from '@stencil/store';
import { TerminalsQueryParams } from '../../api';

const initialState = {};

const terminalsListQueryParams = createStore<TerminalsQueryParams>(() => initialState);
const { state: queryParams, on: onQueryParamsChange } = terminalsListQueryParams;

const clearParams = () => {
  terminalsListQueryParams.reset();
}

export {
  terminalsListQueryParams,
  queryParams,
  onQueryParamsChange,
  clearParams
};