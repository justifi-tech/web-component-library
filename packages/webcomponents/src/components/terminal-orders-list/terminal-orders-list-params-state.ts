import { createStore } from '@stencil/store';
import { TerminalOrderQueryParams } from '../../api';

const filterParamsInitialState = {};
const propsParamsInitialState = {};

const filterParamsStore = createStore<TerminalOrderQueryParams>(() => filterParamsInitialState);
const { state: filterParams, on: onQueryParamsChange } = filterParamsStore;

const propsParamsStore = createStore<TerminalOrderQueryParams>(() => propsParamsInitialState);
const { state: propsParams } = propsParamsStore;

const getRequestParams = (): TerminalOrderQueryParams => {
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