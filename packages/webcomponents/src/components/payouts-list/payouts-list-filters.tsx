import { Component, h, Prop, State } from '@stencil/core';
import { PayoutsTableFilterParams } from '../../api';
import { convertToUTC } from '../../utils/utils';

@Component({
  tag: 'payouts-list-filters'
})
export class PayoutsListFilters {
  @Prop() params: PayoutsTableFilterParams;
  @Prop() setParamsOnChange: (name: string, value: string) => void;
  @Prop() clearParams: () => void;

  @State() createdAfterInputValue: string;
  @State() createdBeforeInputValue: string;

  handleDateInput = (name: string, value: string) => {

    if (name === 'created_after') {
      this.createdAfterInputValue = value;
    } else if (name === 'created_before') {
      this.createdBeforeInputValue = value;
    }

    const utcDate = convertToUTC(value);
    this.setParamsOnChange(name, utcDate);
  }

  clearFilters = () => {
    this.createdAfterInputValue = '';
    this.createdBeforeInputValue = '';
    this.clearParams();
  }

  render() {
    return (
      <table-filters-menu params={this.params} clearParams={this.clearFilters}>
        <div class="grid-cols-2 gap-3 p-1">
          <div class="p-2">
            <form-control-date
              name="created_after"
              label="Start Date"
              inputHandler={this.handleDateInput}
              defaultValue={this.createdAfterInputValue}
            />
          </div>
          <div class="p-2">
            <form-control-date
              name="created_before"
              label="End Date"
              inputHandler={this.handleDateInput}
              defaultValue={this.createdBeforeInputValue}
            />
          </div>
        </div>
      </table-filters-menu>
    );
  }
}
