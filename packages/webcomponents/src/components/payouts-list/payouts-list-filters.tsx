import { Component, h, Prop } from '@stencil/core';
import { PayoutsTableFilterParams } from '../../api';

@Component({
  tag: 'payouts-list-filters'
})
export class PayoutsListFilters {
  @Prop() params: PayoutsTableFilterParams;
  @Prop() setParamsOnChange: (name: string, value: string) => void;
  @Prop() clearParams: () => void;


  render() {
    return (
      <table-filters-menu params={this.params} clearParams={this.clearParams}>
        <div class="grid-cols-2 gap-3 p-1">
          <div class="p-2">
            <form-control-date
              name="created_after"
              label="Start Date"
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.created_after}
              filterTimeZone
              showTime
            />
          </div>
          <div class="p-2">
            <form-control-date
              name="created_before"
              label="End Date"
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.created_before}
              filterTimeZone
              showTime
            />
          </div>
        </div>
      </table-filters-menu>
    );
  }
}
