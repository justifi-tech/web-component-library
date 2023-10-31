import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { PagingInfo, pagingDefaults } from '../table/table-utils';
import { Business } from '../../api/Business';
import { formatDate, snakeCaseToHumanReadable } from '../../utils/utils';

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
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() businesses: Business[] = [];
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
    };
  };

  mapProductStatusToBadge = (status: boolean) => {
    return (status && 'bg-success') || 'bg-secondary';
  };

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage =
        'Can not fetch any data without an AccountID and an AuthToken';
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `entities/business`;

    const response: IApiResponseCollection<Business[]> = await Api(
      this.authToken,
      process.env.ENTITIES_API_ORIGIN,
    ).get(endpoint, {
      account_id: this.accountId,
      paging: this.paging,
      direction: direction,
    });
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
            ['Business Type', 'The business type'],
            ['Business Structure', 'The business structure'],
            ['Tax ID', 'The tax ID associated with this business'],
            ['Industry', 'The industry this business participates in'],
            [
              'Product Ready',
              'List of our products that are used by this business',
            ],
            ['Created at', 'Date this business was created'],
          ]}
          rowData={this.businesses.map(business => [
            business.legal_name,
            snakeCaseToHumanReadable(business.business_type),
            snakeCaseToHumanReadable(business.business_structure),
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
          paging={{
            ...this.paging,
            onPrev: this.onPageChange('prev'),
            onNext: this.onPageChange('next'),
          }}
        />
      </Host>
    );
  }
}
