import { FunctionalComponent, HostAttributes } from "@stencil/core/internal";
import { Host, h } from '@stencil/core';
import modifiedBootstrap from './modified-bootstrap.css';

export const StyledHost: FunctionalComponent<HostAttributes> = (props, children) => {
  return (
    <Host {...props} class="body" style={{ display: 'block' }}>
      <style>{modifiedBootstrap}</style>
      {children}
    </Host>
  );
};
