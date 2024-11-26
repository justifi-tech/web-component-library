import { createStore } from '@stencil/store';

const iframeInputStylesStore = createStore<any>({
  fontFamily: '',
  focused: {
    boxShadow: '',
    border: '',
  },
  focusedAndInvalid: {
    boxShadow: '',
    border: '',
  },
});

const {
  state: iframeInputStyles,
  on: iframeInputStylesOn,
  set: iframeInputStylesSet,
} = iframeInputStylesStore;

export {
  iframeInputStylesStore,
  iframeInputStyles,
  iframeInputStylesOn,
  iframeInputStylesSet,
};
