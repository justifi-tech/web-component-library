import { createStore } from '@stencil/store';

const iframeInputStylesStore = createStore<any>({
  focused: {
    boxShadow: '',
    border: '',
  },
  focusedAndInvalid: {
    boxShadow: '',
    border: '',
  },
  fontStyles: {
    fontFamily: '',
    fontSize: '',
    fontWeight: '',
    lineHeight: '',
    margin: '',
    padding: '',
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
