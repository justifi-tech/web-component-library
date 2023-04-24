import { defineCustomElements } from '../loader';
import { setStencilDocJson, extractArgTypesFactory } from '@pxtrn/storybook-addon-docs-stencil';
import docJson from '../docs.json';
import '../dist/webcomponents/webcomponents.css'

defineCustomElements();

if (docJson) {
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
