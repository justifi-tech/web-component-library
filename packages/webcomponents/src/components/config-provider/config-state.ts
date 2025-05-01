import { createStore } from '@stencil/store';

interface ConfigState {
  apiOrigin?: string;
  iFrameOrigin?: string;
  accountId?: string;
}

const initialState: ConfigState = {
  apiOrigin: PROXY_API_ORIGIN,
  iFrameOrigin: IFRAME_ORIGIN,
  accountId: ''
};

const configStore = createStore<ConfigState>(() => initialState);
const { state: configState, on: onConfigChange } = configStore;

const setConfigState = (vals: Partial<ConfigState>) => {
  Object.assign(configState, vals);
};

const getConfigState = (): ConfigState => configState;

export {
  configState,
  onConfigChange,
  getConfigState,
  setConfigState,
};
