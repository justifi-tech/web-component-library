import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { PagingInfo, pagingDefaults } from '../table/table-utils';
import { Business } from '../../api/Business';
import { formatDate } from '../../utils/utils';

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
    }
  }

  mapProductStatusToBadge = (status: boolean) => {
    return status && 'bg-success' || 'bg-secondary';
  }

  mapBusinessType = (type: string) => {
    switch (type) {
      case 'individual':
        return 'Individual'
      case 'non_profit':
        return 'Non Profit'
      case 'for_profit':
        return 'For Profit'
      case 'government_entity':
        return 'Government Entity'
    }
  }

  mapBusinessStructure = (type: string) => {
    switch (type) {
      case 'sole_proprietorship':
        return 'Sole Proprietorship'
      case 'single_llc':
        return 'Single LLC'
      case 'multi_llc':
        return 'Multi LLC'
      case 'private_partnership':
        return 'Private Partnership'
      case 'private_corporation':
        return 'Private Corporation'
      case 'unincorporated_association':
        return 'Unincorporated Association'
      case 'public_partnership':
        return 'Public Partnership'
      case 'public_corporation':
        return 'Public Corporation'
      case 'incorporated':
        return 'Incorporated'
      case 'unincorporated':
        return 'Unincorporated'
      case 'government_unit':
        return 'Government Unit'
      case 'government_instrumentality':
        return 'Government Instrumentality'
      case 'tax_exempt_government_instrumentality':
        return 'Tax Exempt Government Instrumentality'
    }
  }

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `entities/business`;

    const response: IApiResponseCollection<Business[]> = await Api(this.authToken, 'http://localhost:3020').get(endpoint, {
      account_id: this.accountId,
      paging: this.paging,
      direction: direction
    });
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info
      }

      const data = response?.data?.map(dataItem => new Business(dataItem));
      this.businesses = data;
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
            'Legal Name',
            'Business Type',
            'Business Structure',
            'Tax ID',
            'Industry',
            'Product Ready',
            'Created at',
          ]}
          rowData={
            this.businesses.map((business) => (
              [
                business.legal_name,
                this.mapBusinessType(business.business_type),
                this.mapBusinessStructure(business.business_structure),
                business.tax_id,
                business.industry,
                {
                  type: 'inner',
                  value: `
                    <div class="d-flex flex-nowrap gap-1">
                      <span class="badge ${this.mapProductStatusToBadge(business.product_categories.credit)}">Credit</span>
                      <span class="badge ${this.mapProductStatusToBadge(business.product_categories.insurance)}">Insurance</span>
                      <span class="badge ${this.mapProductStatusToBadge(business.product_categories.lending)}">Lending</span>
                      <span class="badge ${this.mapProductStatusToBadge(business.product_categories.payment)}">Payment</span>
                    </div>
                  `
                },
                formatDate(business.created_at),
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
