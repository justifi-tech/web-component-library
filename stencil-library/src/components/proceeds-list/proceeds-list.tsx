import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { formatDate } from '../../utils/utils';
import { PagingInfo, pagingDefaults } from '../table/table-utils';
import { Proceed, ProceedStatuses, ProceedStatusesSafeNames } from '../../api/Proceed';

/**
  * @exportedPart table-head: Table head
  * @exportedPart table-head-row: Head row
  * @exportedPart table-head-cell: Individual head cell
  * @exportedPart table-body: Body of the table
  * @exportedPart table-row: Row of the table
  * @exportedPart table-cell: Individual cell of the table
  * @exportedPart loading-state-cell: Row for loading state
  * @exportedPart loading-state-spinner: Spinner element for loading state
  * @exportedPart error-state: Row for Error state
  * @exportedPart empty-state: Row for Emtpy state
  * @exportedPart pagination-bar: Pagination bar
  * @exportedPart arrow: Both paging buttons
  * @exportedPart arrow-left: Previous page button
  * @exportedPart arrow-right: Next page button
  * @exportedPart arrow-disabled: Disabled state for paging buttons
*/
@Component({
  tag: 'justifi-proceeds-list',
  styleUrl: 'proceeds-list.scss',
  shadow: true,
})

export class ProceedsList {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() proceeds: Proceed[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;

  @Watch('accountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  onPageChange = (direction: string) => {
    return () => {
      this.fetchData(direction);
    }
  }

  mapStatusToBadge = (status: ProceedStatuses) => {
    switch (status) {
      case ProceedStatuses.scheduled || ProceedStatuses.in_transit:
        return 'bg-primary';
      case ProceedStatuses.failed || ProceedStatuses.canceled:
        return 'bg-danger';
      case ProceedStatuses.forwarded:
        return 'bg-secondary';
      case ProceedStatuses.paid:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const limit = this.paging.amount;
    const cursor = `${
      direction === 'prev'
      ? '&before_cursor='+this.paging.start_cursor
      : direction === 'next'
        ? '&after_cursor='+this.paging.end_cursor
        : ''
    }`;
    const endpoint = `account/${this.accountId}/proceeds?limit=${limit}${cursor ? cursor : ''}`;

    const response: IApiResponseCollection<Proceed[]> = await Api(this.authToken).get(endpoint);
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info
      }

      const data = response?.data?.map(dataItem => new Proceed(dataItem));
      this.proceeds = data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        <justifi-table
          columnData={[
            'Paid Out On',
            'Paid Out To',
            'From Payments',
            'From Refunds',
            'Other',
            'Proceeds Amount',
            'Status',
          ]}
          rowData={
            this.proceeds.map((proceed) => (
              [
                {
                  type: 'head',
                  value: formatDate(proceed.deposits_at),
                },
                proceed.bank_account.full_name,
                proceed.payments_total,
                proceed.refunds_total,
                proceed.other_total,
                proceed.amount,
                {
                  type: 'inner',
                  value: `<span class="badge ${this.mapStatusToBadge(proceed.status)}">${ProceedStatusesSafeNames[proceed.status]}</span>`
                }
              ]
            ))
          }
          loading={this.loading}
          error-message={this.errorMessage}
          paging={{
            ...this.paging,
            onPrev: this.onPageChange('prev'),
            onNext: this.onPageChange('next')
          }}
        />
      </Host>
    );
  }
}
