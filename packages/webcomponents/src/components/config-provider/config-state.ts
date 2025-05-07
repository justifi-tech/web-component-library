import { createStore } from '@stencil/store';

interface ConfigState {
  apiOrigin?: string;
  iframeOrigin?: string;
  accountId?: string;
}

const initialState: ConfigState = {
  apiOrigin: PROXY_API_ORIGIN,
  iframeOrigin: IFRAME_ORIGIN,
  accountId: '',
};

const configStore = createStore<ConfigState>(() => initialState);
const { state: configState, on: onConfigChange } = configStore;

// resolver for the “ready” promise
let resolveConfigReady: () => void;

// initial “handshake” promise
const configReady = new Promise<void>(r => {
  resolveConfigReady = r;
});

// called by <justifi-config-provider>
const setConfigState = (vals: Partial<ConfigState>) => {
  Object.assign(configState, vals);
  resolveConfigReady();
};

/**
 * Wait for configProvider to run, but safe guard against never mounting.
 * @param timeoutMs max time to wait before resolving with default values
 */
const waitForConfig = (timeoutMs = 200): Promise<void> => {
  return new Promise<void>(resolve => {
    const timer = setTimeout(() => {
      // timeout expired, proceed with default config state values
      resolve();
    }, timeoutMs);

    configReady.then(() => {
      clearTimeout(timer);
      resolve();
    });
  });
};

export {
  configState,
  onConfigChange,
  setConfigState,
  waitForConfig
};
