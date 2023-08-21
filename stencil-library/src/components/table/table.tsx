import { Component, Host, h, Prop } from '@stencil/core';
import { PagingInfo, pagingDefaults } from '../table/table-utils';

interface ExtendedPagingInfo extends PagingInfo {
  onPrev: () => void;
  onNext: () => void;
}

const ExtendedPagingDefaults: ExtendedPagingInfo = {
  ...pagingDefaults,
  onPrev: () => {},
  onNext: () => {},
}

export interface TableProps {
  loading: boolean;
  errorMessage: string;
  columnData: (string|string[])[];
  rowData: any[];
  paging: ExtendedPagingInfo;
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

  showEmptyState() {
    return this.rowData ? this.rowData.length < 1 : true;
  }

  emptyState = () => (
    <tr>
      <td class="empty-state" part="empty-state" colSpan={this.columnData?.length} style={{ textAlign: 'center' }}>No payments to show</td>
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

  paginationBar = () => {
    return (
      <div class="d-flex justify-content-center gap-3">
        <button
          onClick={this.paging.onPrev}
          part={`arrow arrow-left${this.paging.has_previous ? '' : ' arrow-disabled'}`}
          disabled={!this.paging.has_previous}
          class={`btn btn-primary ${this.paging.has_previous ? '' : ' disabled'}`}
        >&larr;</button>
        <button
          onClick={this.paging.onNext}
          part={`arrow arrow-right${this.paging.has_next ? '' : ' arrow-disabled'}`}
          disabled={!this.paging.has_next}
          class={`btn btn-primary ${this.paging.has_next ? '' : ' disabled'}`}
        >&rarr;</button>
      </div>
    )
  };

  render() {
    return (
      <Host exportparts="
        table-head,table-head-row,table-head-cell,table-body,table-row,table-row-even,
        table-row-odd,table-cell,loading-state-cell,loading-state-spinner,error-state,
        empty-state,pagination-bar,arrow,arrow-left,arrow-right,arrow-disabled
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
              this.rowData?.map((payment, index) => (
                <tr part={`table-row${index%2 ? ' table-row-even' : ' table-row-odd'}`}>
                  {
                    payment.map((paymentEntry: any) =>
                      { return (
                          !paymentEntry?.type
                          ? <td part="table-cell">{paymentEntry}</td>
                          : <th scope="row" part="table-cell">
                              <td part="table-cell" innerHTML={paymentEntry.value}></td>
                            </th>
                        )
                      }
                    )
                  }
                </tr>
              ))
            }
          </tbody>
          {this.paging &&
            <tfoot class="sticky-bottom">
              <tr class="table-light align-middle">
                <td part="pagination-bar" colSpan={this.columnData?.length}>
                  {this.paginationBar()}
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
