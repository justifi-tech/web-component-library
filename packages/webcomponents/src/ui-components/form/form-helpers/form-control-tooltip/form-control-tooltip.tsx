import { Component, Listen, Prop, State, h } from '@stencil/core';
import { tooltip, tooltipIcon, tooltipInner } from '../../../../styles/parts';

@Component({
  tag: 'form-control-tooltip'
})
export class TooltipComponent {
  @State() anchorIcon: SVGElement;
  @State() tooltip: HTMLElement;

  @Prop() helpText: string;

  @Listen('showEvent')
  show() {
    this.tooltip.classList.add('show');
  }

  @Listen('hideEvent')
  hide() {
    this.tooltip.classList.remove('show');
  }

  render() {
    if (!this.helpText) {
      return null;
    }

    return (
      <div class="tooltip-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-question-square tooltip-icon"
          viewBox="0 0 16 16"
          ref={(el) => (this.anchorIcon = el)}
          part={tooltipIcon}
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
        </svg>
        <custom-popper
          trigger="hover"
          placement="top"
          anchorRef={this.anchorIcon}
        >
          <div class="tooltip bs-tooltip-top" part={tooltip} role="tooltip" ref={(el) => (this.tooltip = el)}>
            <div class="tooltip-inner" part={tooltipInner}>
              {this.helpText}
            </div>
          </div>
        </custom-popper>
      </div>
    );
  }
}
