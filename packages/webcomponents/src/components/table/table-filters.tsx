import { Component, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { Button } from '../../ui-components';

@Component({
  tag: 'table-filters'
})
export class TableFilters {
  @Prop() params: any;
  @Event() clearParams: EventEmitter<any>;
  @Event() setParamsOnChange: EventEmitter<any>;

  get hasFilters() {
    const paginationKeys = ['after_cursor', 'before_cursor'];
    const paramKeys = Object.keys(this.params);
    const filterKeys = paramKeys.filter((paramKey) => !paginationKeys.includes(paramKey));
    return !!filterKeys.length;
  }

  private clearFilters() {
    this.clearParams.emit({});
  }

  @Listen('setParamsOnChange')
  setParams(event: CustomEvent) {
    this.setParamsOnChange.emit(event.detail);
  }



  render() {
    return (
      <div class="container mt-2">
        <div class="row gy-3 mb-4">
          <slot></slot>
        </div>
        {this.hasFilters && (
          <div class="row">
            <div class="col">
              <Button variant='primary' onClick={() => this.clearFilters()}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
