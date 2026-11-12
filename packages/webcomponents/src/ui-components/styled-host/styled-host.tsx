import { FunctionalComponent, HostAttributes } from "@stencil/core/internal";
import { Host, h } from '@stencil/core';
import styledHostStyles from './styled-host.css';

// Every selector in styled-host.css is scoped to `:host, .jfi-styled-host`.
// :host covers the shadow-DOM components; .jfi-styled-host is what the two
// light-DOM ones (justifi-checkout, plaid-verification) match on, so their copy
// of Bootstrap cannot style the merchant's page.
//
// Descendant selectors use :where(), which adds no specificity, so `p` is still
// (0,0,1) exactly as in an unscoped build. The few rules whose subject IS the
// root use :is() instead: they carried :host's own (0,1,0) before scoping, and
// :where() would have dropped them under every bare-element rule.
export const StyledHost: FunctionalComponent<HostAttributes> = (props, children) => {
  return (
    <Host {...props} class="body jfi-styled-host" style={{ display: 'block' }}>
      <style>{styledHostStyles}</style>
      {children}
    </Host>
  );
};
