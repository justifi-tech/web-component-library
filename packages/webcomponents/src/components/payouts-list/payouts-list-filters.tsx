import { Component, h } from '@stencil/core';
import { queryParams, clearParams } from './payouts-list-params-state';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-payouts-list-filters',
  shadow: true
})
export class PayoutsListFilters {
  
  setParamsOnChange = (name: string, value: string) => {
    queryParams[name] = value;
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
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.created_after}
                filterTimeZone
                showTime
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="End Date"
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.created_before}
                filterTimeZone
                showTime
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    );
  }
}
