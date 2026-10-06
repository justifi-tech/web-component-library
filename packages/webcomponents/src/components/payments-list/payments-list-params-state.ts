import { createStore } from '@stencil/store';
import { PaymentsQueryParams } from '../../api';

const filterParamsInitialState = {};
const propsParamsInitialState = {};

const filterParamsStore = createStore<PaymentsQueryParams>(() => filterParamsInitialState);
const { state: filterParams, on: onQueryParamsChange } = filterParamsStore;

const propsParamsStore = createStore<PaymentsQueryParams>(() => propsParamsInitialState);
const { state: propsParams } = propsParamsStore;

const getRequestParams = (): PaymentsQueryParams => {
  return {
    ...filterParams,
    ...propsParams
  };
};

const clearParams = () => {
  filterParamsStore.reset();
}

export {
  filterParams,
  propsParams,
  onQueryParamsChange,
  clearParams,
  getRequestParams
};
