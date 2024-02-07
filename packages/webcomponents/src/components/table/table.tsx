import { Component, Host, h, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';
import { tableExportedParts } from './exported-parts';
import { EmptyState, ErrorState, LoadingState } from './utils';

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
      <Host exportparts={tableExportedParts}>
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part='table-head-row'>
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
              {this.loading && LoadingState(this.columnData.length)}
              {this.showEmptyState && EmptyState(this.columnData.length)}
              {this.showErrorState && ErrorState(this.columnData.length, this.errorMessage)}
              {this.showRowData && (
                  this.rowData.map((data, index) => {
                    return (
                      <tr
                        data-row-entity-id={this.entityId[index]}
                        onClick={e => this.rowClickHandler ? this.rowClickHandler(e) : null}
                        part={`table-row ${index % 2 ? 'table-row-even' : 'table-row-odd'}`}
                      >
                        {
                          data.map((dataEntry: any) => {
                            let nestedHtml = dataEntry?.type;
                            if (nestedHtml) {
                              return (
                                <td part="table-cell" innerHTML={dataEntry.value}></td>
                              )
                            } else {
                              return (
                                <td part="table-cell">{dataEntry}</td>
                              )
                            }
                          })
                        }
                      </tr>
                    )
                  })
                )}
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
        </div>
      </Host>
    )
  }
}
