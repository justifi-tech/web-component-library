import { createStore } from '@stencil/store';
import { PayoutsQueryParams } from '../../api';

const filterParamsInitialState = {};
const propsParamsInitialState = {};

const filterParamsStore = createStore<PayoutsQueryParams>(() => filterParamsInitialState);
const { state: filterParams, on: onQueryParamsChange } = filterParamsStore;

const propsParamsStore = createStore<PayoutsQueryParams>(() => propsParamsInitialState);
const { state: propsParams } = propsParamsStore;

const getRequestParams = (): PayoutsQueryParams => {
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
