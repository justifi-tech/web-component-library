import { createStore } from '@stencil/store';
import { TerminalsQueryParams } from '../../api';

const filterParamsInitialState = {};
const propsParamsInitialState = {};

const filterParamsStore = createStore<TerminalsQueryParams>(() => filterParamsInitialState);
const { state: filterParams, on: onQueryParamsChange } = filterParamsStore;

const propsParamsStore = createStore<TerminalsQueryParams>(() => propsParamsInitialState);
const { state: propsParams } = propsParamsStore;

const getRequestParams = (): TerminalsQueryParams => {
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
