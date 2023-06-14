import { setStencilDocJson, extractArgTypesFactory } from '@pxtrn/storybook-addon-docs-stencil';
import { defineCustomElements } from '../loader';
import docJson from '../docs.json';
import '../dist/webcomponents/webcomponents.css';

defineCustomElements();

if (docJson) {
  setStencilDocJson(docJson);
}

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  docs: {
    extractArgTypes: extractArgTypesFactory({ dashCase: true }),
  },
  controls: {
    hideNoControlsWarning: true,
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
