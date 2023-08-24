import { Plugin } from 'vue';
import {
  applyPolyfills,
  defineCustomElements,
} from '../../stencil-library/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
