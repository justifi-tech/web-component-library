import { createStore } from '@stencil/store';
import { CheckoutsQueryParams } from '../../api';

const filterParamsInitialState = {};
const propsParamsInitialState = {};

const filterParamsStore = createStore<CheckoutsQueryParams>(() => filterParamsInitialState);
const { state: filterParams, on: onQueryParamsChange } = filterParamsStore;

const propsParamsStore = createStore<CheckoutsQueryParams>(() => propsParamsInitialState);
const { state: propsParams } = propsParamsStore;

const getRequestParams = (): CheckoutsQueryParams => {
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
