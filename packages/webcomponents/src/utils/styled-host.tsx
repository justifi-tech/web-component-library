import { FunctionalComponent, HostAttributes } from "@stencil/core/internal";
import { Host, h } from '@stencil/core';

import * as bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

const hostStyles = `
:host>* {
  margin: 0;
  font-family: var(--bs-body-font-family);
  font-size: var(--bs-body-font-size);
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
  color: var(--bs-body-color);
  text-align: var(--bs-body-text-align);
  background-color: var(--bs-body-bg);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`;


const StyledHost: FunctionalComponent<HostAttributes> = (props, children) => {
  return (
    <Host {...props}>
      <style>{bootstrap.default}</style>
      <style>{hostStyles}</style>
      {children}
    </Host>
  );
};

export default StyledHost;