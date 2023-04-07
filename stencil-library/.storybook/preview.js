import {defineCustomElements} from '../loader';
import { setStencilDocJson, extractArgTypesFactory } from '@pxtrn/storybook-addon-docs-stencil';
import docJson from '../docs.json';

defineCustomElements();

if(docJson) {
  setStencilDocJson(docJson);
}

export const parameters = {
  actions: { argTypesRegex: "^on.*" },
  docs: {
    extractArgTypes: extractArgTypesFactory({ dashCase: true }),
  },
  controls: {
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
