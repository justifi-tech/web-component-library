import { Component, h } from '@stencil/core';

@Component({
  tag: 'justifi-insurance-legal',
  shadow: true,
})

export class InsuranceLegal {
  render() {
    <div>
      <slot></slot>
    </div>
  };
};