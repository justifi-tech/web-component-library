import { Component, h, Prop } from '@stencil/core';
import { filterParams, propsParams, clearParams } from './payouts-list-params-state';
import { StyledHost } from '../../ui-components';
import { convertToLocal, convertToUTC } from '../../utils/utils';
import { createdAfterPayoutsListFilterParam, payoutsListFilterMenu } from '../../styles/parts';
@Component({
  tag: 'justifi-payouts-list-filters',
  shadow: true
})
export class PayoutsListFilters {
  @Prop() createdAfter?: string;
  @Prop() createdBefore?: string;

  componentWillLoad() {
    const propsToSet = {
      created_after: this.createdAfter,
      created_before: this.createdBefore
    };

    Object.entries(propsToSet).forEach(([key, value]) => {
      if (value) {
        propsParams[key] = value;
      }
    });
  }
  
  setParamsOnChange = (name: string, value: string) => {
    filterParams[name] = value;
  }

  handleDateInput = (name: string, value: string) => {
    const utcDate = convertToUTC(value, { setEndOfDay: true });
    this.setParamsOnChange(name, utcDate);
  }

  render() {
    const filterMenuParams = { ...filterParams }

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams} part={payoutsListFilterMenu}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-date
                name="created_after"
                label="Created After"
                inputHandler={this.handleDateInput}
                defaultValue={
                  convertToLocal(this.createdAfter, { showInputDate: true }) ||
                  convertToLocal(filterParams.created_after, { showInputDate: true })
                }
                disabled={!!this.createdAfter}
                part={createdAfterPayoutsListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="Created Before"
                inputHandler={this.handleDateInput}
                defaultValue={
                  convertToLocal(this.createdBefore, { showInputDate: true }) ||
                  convertToLocal(filterParams.created_before, { showInputDate: true })
                }
                disabled={!!this.createdBefore}
                part={createdAfterPayoutsListFilterParam}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    );
  }
}
