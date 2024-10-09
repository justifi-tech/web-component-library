import { Component, Prop, h, Element } from '@stencil/core';
import Tooltip from 'bootstrap/js/dist/tooltip';
import { StyledHost } from './styled-host/styled-host';

@Component({
  tag: 'custom-tool-tip',
  shadow: true
})
export class CustomTooltip {
  @Prop() text: string;

  @Element() el: HTMLElement;

  componentDidLoad() {
    const toolTipOptions = {
      trigger: 'click',
      placement: 'auto',
      container: this.el.shadowRoot,
      animation: true,
      delay: { show: 500, hide: 100 },
    };
    const tooltipTriggerEl = this.el.shadowRoot.querySelector('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerEl) {
      new Tooltip(tooltipTriggerEl, toolTipOptions);
    }
  }

  render() {
    return (
      <StyledHost exportparts='tooltip'>
        <span
          data-bs-toggle='tooltip'
          data-bs-title={this.text}
          part='tooltip'
        >
          <slot></slot>
        </span>
      </StyledHost>
    );
  }
}
