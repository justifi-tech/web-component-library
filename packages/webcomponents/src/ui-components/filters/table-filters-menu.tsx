import { Component, Event, EventEmitter, Listen, Prop, State, Watch, h } from '@stencil/core';
import { Button } from '../button';

@Component({
  tag: 'table-filters-menu'
})
export class TableFiltersMenu {
  @State() anchorButton: HTMLElement;
  @State() menu: HTMLElement;
  @State() showClearButton: boolean = false;
  
  @Prop() filters: any;
  @Prop() params: any;

  @Watch('params')
  watchParamsHandler(newValue: any) {
    this.showClearButton = Object.keys(newValue).length > 0;
  }

  @Event() clearParams: EventEmitter;

  @Listen('showEvent')
  show() {
    this.menu.classList.add('show');
  }

  @Listen('hideEvent')
  hide() {
    this.menu.classList.remove('show');
  }

  emitClearParams() {
    this.clearParams.emit();
  }

  render() {
    return (
      <div class='d-flex gap-2'>
        <div class='dropdown pb-3'>
          <Button
            variant='primary'
            type='button dropdown-toggle'
            ref={(el) => (this.anchorButton = el)}
            class='btn btn-primary dropdown-toggle'
            data-test-id='open-filters-button'
            data-bs-toggle='dropdown'
          >
            {'Filters'}
          </Button>
          <custom-popper
            offset={[20, 10]}
            strategy='fixed'
            anchorRef={this.anchorButton}
            trigger='click'
          >
            <form 
              class='dropdown-menu'
              data-test-id='filter-menu'
              ref={(el) => (this.menu = el)} 
              onSubmit={(e) => e.preventDefault()}
            >
              {this.filters}
            </form>
          </custom-popper>
        </div>
        <div>
          <Button 
            variant='secondary'
            onClick={() => this.emitClearParams()}
            hidden={!this.showClearButton}
            data-test-id='clear-filters-button'
          >
            {'Clear Filters'}  
          </Button>
        </div>
      </div>
    );
  }
}
