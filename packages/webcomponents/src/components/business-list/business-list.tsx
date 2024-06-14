import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, PagingInfo, pagingDefaults } from '../../api';
import { Business, IBusiness } from '../../api/Business';
import { formatDate, snakeCaseToHumanReadable } from '../../utils/utils';
import { config } from '../../../config';


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
  tag: 'justifi-business-list',
  styleUrl: 'business-list.scss',
  shadow: true,
})
export class BusinessList {
  /**
   * The Account ID to fetch payments.
   * This is required to fetch any data.
   * @required
   * @type {string}
   * @memberof PaymentsList
   */
  @Prop() accountId: string;
  /**
   * The Auth Token to fetch payments.
   * This is required to fetch any data.
   * @required
   * @type {string}
   */
  @Prop() authToken: string;
  @State() businesses: Business[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: any

  @Watch('accountId')
  @Watch('authToken')
  @Watch('params')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  mapProductStatusToBadge = (status: boolean) => {
    return (status && 'bg-success') || 'bg-secondary';
  };

  handleClickPrevious = (beforeCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.after_cursor;
    this.params = ({ ...newParams, before_cursor: beforeCursor });
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.before_cursor;
    this.params = ({ ...newParams, after_cursor: afterCursor });
  };

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage =
        'Can not fetch any data without an AccountID and an AuthToken';
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `entities/business`;
    let accountIDParam = { account_id: this.accountId };

    const response: IApiResponseCollection<Business[]> = await Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin },)
      .get(endpoint, { ...accountIDParam, ...this.params });

    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info,
      };

      const data = response?.data?.map(dataItem => new Business(dataItem));
      this.businesses = data;
    } else {
      this.errorMessage =
        typeof response.error === 'string'
          ? response.error
          : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        <justifi-table
          columnData={[
            ['Legal Name', 'The name associated with this Business'],
            ['Business Classification', 'The business classification'],
            ['Tax ID', 'The tax ID associated with this business'],
            ['Industry', 'The industry this business participates in'],
            [
              'Product Ready',
              'List of our products that are used by this business',
            ],
            ['Created at', 'Date this business was created'],
          ]}
          rowData={this.businesses.map((business: IBusiness) => [
            business.legal_name,
            snakeCaseToHumanReadable(business.classification),
            business.tax_id,
            business.industry,
            {
              type: 'inner',
              value: `
                    <div class="d-flex flex-nowrap gap-1">
                      <span class="badge ${this.mapProductStatusToBadge(
                business.product_categories.credit,
              )}">Credit</span>
                      <span class="badge ${this.mapProductStatusToBadge(
                business.product_categories.insurance,
              )}">Insurance</span>
                      <span class="badge ${this.mapProductStatusToBadge(
                business.product_categories.lending,
              )}">Lending</span>
                      <span class="badge ${this.mapProductStatusToBadge(
                business.product_categories.payment,
              )}">Payment</span>
                    </div>
                  `,
            },
            formatDate(business.created_at),
          ])}
          loading={this.loading}
          error-message={this.errorMessage}
          params={this.params}
          paging={{
            ...this.paging,
            handleClickNext: this.handleClickNext,
            handleClickPrevious: this.handleClickPrevious
          }}
        />
      </Host>
    );
  }
}
