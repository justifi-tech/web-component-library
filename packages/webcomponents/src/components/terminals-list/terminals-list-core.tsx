import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Terminal, TerminalsTableFilterParams, pagingDefaults } from '../../api';
import { MapTerminalStatusToBadge } from '../../utils/utils';
import { ComponentError } from '../../api/ComponentError';
import { tableExportedParts } from '../table/exported-parts';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { onFilterChange } from '../../ui-components/filters/utils';

@Component({
  tag: 'terminals-list-core'
})
export class TerminalsListCore {
  @State() terminals: Terminal[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: TerminalsTableFilterParams = {};

  @Prop() getTerminals: Function;

  @Watch('params')
  @Watch('getTerminals')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({
    eventName: 'terminal-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Terminal>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    if (this.getTerminals) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.loading = true;

    this.getTerminals({
      params: this.params,
      onSuccess: ({ terminals, pagingInfo }) => {
        this.terminals = terminals;
        this.paging = pagingInfo;
        this.loading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
        this.loading = false;
      },
    });
  }

  handleClickPrevious = (beforeCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.after_cursor;
    this.params = { ...newParams, before_cursor: beforeCursor };
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.before_cursor;
    this.params = { ...newParams, after_cursor: afterCursor };
  };

  rowClickHandler = (e) => {
    const clickedTerminalID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedTerminalID) return;
    this.rowClicked.emit(this.terminals.find((terminal) => terminal.id === clickedTerminalID));
  };

  setParamsOnChange = (name: string, value: string) => {
    let newParams = { [name]: value };
    this.params = onFilterChange(newParams, this.params);
  }

  clearParams = () => {
    this.params = {};
  }

  get entityId() {
    return this.terminals.map((terminal) => terminal.id);
  }

  get columnData() {
    return [
      ['Sub Account', 'The sub account associated with the terminal'],
      ['Terminal Nickname', 'The nickname of the terminal'],
      ['Provider ID', 'The provider ID of the terminal'],
      ['Status', 'The status of the terminal']
    ];
  };
  
  get rowData() {
    return this.terminals.map((terminal) => [
      terminal.sub_account_name,
      terminal.nickname,
      terminal.provider_id,
      {
        type: 'inner',
        value: MapTerminalStatusToBadge(terminal.status)
      }
    ])
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.rowData.length < 1;
  }

  get showErrorState() {
    return !this.loading && !!this.errorMessage;
  }

  get showRowData() {
    return !this.showEmptyState && !this.showErrorState;
  }

  render() {
    return (
      <StyledHost exportparts={tableExportedParts}>
        <payments-list-filters 
          params={this.params} 
          setParamsOnChange={this.setParamsOnChange}
          clearParams={this.clearParams}
        />
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.columnData?.map((column) => (
                  <th part="table-head-cell" scope="col" title={Array.isArray(column) ? column[1] : ""}>
                    {!Array.isArray(column) ? column : column[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
              <TableLoadingState
                columnSpan={this.columnData.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.columnData.length}
              />
              <TableErrorState
                columnSpan={this.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData &&
                this.rowData.map((data, index) => (
                  <tr
                    data-test-id="table-row"
                    data-row-entity-id={this.entityId[index]}
                    onClick={this.rowClickHandler}
                    part={`table-row ${index % 2 ? "table-row-even" : "table-row-odd"}`}
                  >
                    {data.map((dataEntry: any) => {
                      let nestedHtml = dataEntry?.type;
                      if (nestedHtml) {
                        return <td part="table-cell" innerHTML={dataEntry.value}></td>;
                      } else {
                        return <td part="table-cell">{dataEntry}</td>;
                      }
                    })}
                  </tr>
                ))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.columnData?.length}>
                    <pagination-menu
                      paging={{
                        ...this.paging,
                        handleClickPrevious: this.handleClickPrevious,
                        handleClickNext: this.handleClickNext,
                      }}
                      params={this.params}
                    />
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </StyledHost>
    );
  }
}
