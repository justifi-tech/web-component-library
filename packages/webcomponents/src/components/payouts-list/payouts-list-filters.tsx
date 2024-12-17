import { Component, h, Prop } from '@stencil/core';
import { PayoutsTableFilterParams } from '../../api';
import { convertToLocal, convertToUTC } from '../../utils/utils';

@Component({
  tag: 'payouts-list-filters'
})
export class PayoutsListFilters {
  @Prop() params: PayoutsTableFilterParams;
  @Prop() setParamsOnChange: (name: string, value: string) => void;
  @Prop() clearParams: () => void;

  handleDateInput = (name: string, value: string) => {
    const utcDate = convertToUTC(value, { setEndOfDay: true });
    this.setParamsOnChange(name, utcDate);
  }

  render() {
    return (
      <table-filters-menu params={this.params} clearParams={this.clearParams}>
        <div class="grid-cols-2 gap-3 p-1">
          <div class="p-2">
            <form-control-date
              name="created_after"
              label="Created After"
              inputHandler={this.handleDateInput}
              defaultValue={convertToLocal(this.params.created_after, { showInputDate: true })}
            />
          </div>
          <div class="p-2">
            <form-control-date
              name="created_before"
              label="Created Before"
              inputHandler={this.handleDateInput}
              defaultValue={convertToLocal(this.params.created_before, { showInputDate: true })}
            />
          </div>
        </div>
      </table-filters-menu>
    );
  }
}
