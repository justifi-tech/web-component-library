import { FunctionalComponent, HostAttributes } from "@stencil/core/internal";
import { Host, h } from '@stencil/core';
import styledHostStyles from './styled-host.css';

export const StyledHost: FunctionalComponent<HostAttributes> = (props, children) => {
  return (
    <Host {...props} class="body" style={{ display: 'block' }}>
      <style>{styledHostStyles}</style>
      {children}
    </Host>
  );
};
