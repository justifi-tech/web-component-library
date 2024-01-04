import { Component, Host, h, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';

export interface TableProps {
  loading: boolean;
  errorMessage: string;
  columnData: (string | string[])[];
  rowData: any[];
  paging: ExtendedPagingInfo;
  params: any
}

@Component({
  tag: 'justifi-table',
  styleUrl: './table.scss',
  shadow: true,
})

export class Table {
  @Prop() loading: TableProps['loading'] = true;
  @Prop() errorMessage: TableProps['errorMessage'] = '';
  @Prop() rowData: TableProps['rowData'] = [];
  @Prop() columnData!: TableProps['columnData'];
  @Prop() paging: TableProps['paging'] = ExtendedPagingDefaults;
  @Prop() params: TableProps['params'] = {};
  @Prop() entityId: string[];
  @Prop() rowClickHandler: (e: any) => any;

  showEmptyState() {
    return this.rowData ? this.rowData.length < 1 : true;
  }

  emptyState = () => (
    <tr>
      <td class="empty-state" part="empty-state" colSpan={this.columnData?.length} style={{ textAlign: 'center' }}>No results</td>
    </tr>
  );

  errorState = () => (
    <tr>
      <td class="error-state" part="error-state" colSpan={this.columnData?.length} style={{ textAlign: 'center' }}>
        An unexpected error occurred: {this.errorMessage}
      </td>
    </tr>
  );

  loadingState = () => (
    <tr>
      <td class="loading-state" part="loading-state-cell" colSpan={this.columnData?.length} style={{ textAlign: 'center' }}>
        <div part="loading-state-spinner" class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  );

  render() {
    return (
      <Host exportparts="
        table-head,table-head-row,table-head-cell,table-body,table-row,table-row-even,
        table-row-odd,table-cell,loading-state-cell,loading-state-spinner,error-state,
        empty-state,pagination-bar,arrow,arrow-left,arrow-right,button-disabled,
        previous-button-text,next-button-text
      ">
        {this.columnData ?
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light" part='table-head-row'>
                {
                  this.columnData?.map((column) =>
                    <th part="table-head-cell" scope="col" title={Array.isArray(column) ? column[1] : ''}>
                      {!Array.isArray(column) ? column : column[0]}
                    </th>
                  )
                }
              </tr>
            </thead>
            <tbody class="table-body" part='table-body'>
              {
                this.loading ? this.loadingState() :
                  this.errorMessage ? this.errorState() :
                    this.showEmptyState() ? this.emptyState() :
                      this.rowData?.map((data, index) => {
                        return (
                          <tr
                            data-row-entity-id={this.entityId[index]}
                            onClick={e => this.rowClickHandler ? this.rowClickHandler(e) : null}
                            part={`table-row${index % 2 ? ' table-row-even' : ' table-row-odd'}`}
                          >
                            {
                              data.map((dataEntry: any) => {
                                return (
                                  !dataEntry?.type
                                    ? <td part="table-cell">{dataEntry}</td>
                                    : <th scope="row" part="table-cell">
                                      <td part="table-cell" innerHTML={dataEntry.value}></td>
                                    </th>
                                )
                              }
                              )
                            }
                          </tr>
                        )
                      })
              }
            </tbody>
            {this.paging &&
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.columnData?.length}>
                    <pagination-menu paging={this.paging} params={this.params} />
                  </td>
                </tr>
              </tfoot>
            }
          </table>
          :
          <div data-test-id="empty-error-state">Column data is required</div>}
      </Host>
    )
  }
}
