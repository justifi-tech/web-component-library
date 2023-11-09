import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pagination-menu',
  shadow: true,
})
export class PaginationMenu {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
