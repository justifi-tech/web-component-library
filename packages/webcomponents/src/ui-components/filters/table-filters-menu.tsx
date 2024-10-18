import { Component, Prop, State, h } from '@stencil/core';
// import { StyledHost } from '../styled-host/styled-host';

@Component({
  tag: 'table-filters-menu'
})
export class TableFiltersMenu {
  @Prop() filters: any;

  @State() anchorButton: HTMLElement;


  componentDidLoad() {
    console.log('anchorButton in tableFiltersMenu', this.anchorButton);
  }

  render() {
    return (
      <div>
        <button
          type='button'
          ref={(el) => (this.anchorButton = el)}
          class='btn btn-primary'
        >
          {'Filters '}
        </button>
        <custom-popper
          offset={[0, 15]}
          strategy='fixed'
          anchorRef={this.anchorButton}
          trigger='click'
        >
          {this.filters}
        </custom-popper>
      </div>
    );
  }
}
