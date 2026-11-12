import { FunctionalComponent, HostAttributes } from "@stencil/core/internal";
import { Host, h } from '@stencil/core';
import styledHostStyles from './styled-host.css';

// Every selector in styled-host.css is scoped to `:where(:host, .jfi-styled-host)`.
// :host covers the shadow-DOM components; .jfi-styled-host is what the two
// light-DOM ones (justifi-checkout, plaid-verification) match on, so their copy
// of Bootstrap cannot style the merchant's page. :where() adds no specificity,
// so the cascade inside a component is the same as an unscoped Bootstrap build.
export const StyledHost: FunctionalComponent<HostAttributes> = (props, children) => {
  return (
    <Host {...props} class="body jfi-styled-host" style={{ display: 'block' }}>
      <style>{styledHostStyles}</style>
      {children}
    </Host>
  );
};
