import { Component, h } from '@stencil/core';
import { queryParams, clearParams } from './payouts-list-params-state';
import { StyledHost } from '../../ui-components';
import { convertToLocal, convertToUTC } from '../../utils/utils';
@Component({
  tag: 'justifi-payouts-list-filters',
  shadow: true
})
export class PayoutsListFilters {
  
  setParamsOnChange = (name: string, value: string) => {
    queryParams[name] = value;
  }

  handleDateInput = (name: string, value: string) => {
    const utcDate = convertToUTC(value, { setEndOfDay: true });
    this.setParamsOnChange(name, utcDate);
  }

  render() {
    return (
      <StyledHost>
        <table-filters-menu params={ {...queryParams} } clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-date
                name="created_after"
                label="Start Date"
                inputHandler={this.handleDateInput}
                defaultValue={convertToLocal(queryParams.created_after, { showInputDate: true })}
                showTime
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="End Date"
                inputHandler={this.handleDateInput}
                defaultValue={convertToLocal(queryParams.created_before, { showInputDate: true })}
                showTime
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    );
  }
}
