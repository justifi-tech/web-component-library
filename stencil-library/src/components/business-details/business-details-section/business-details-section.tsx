import { Component, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { Address, IBusiness } from '../../../api/Business';
import { formatDate } from '../../../utils/utils';

@Component({
  tag: 'business-details-section',
  styleUrl: 'business-details-section.scss',
  shadow: true,
})
export class BusinessDetailsSection {
  @Prop() business: IBusiness;

  formatAddress(address: Address): string {
    return `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`;
  }

  render() {
    return (
      <DetailSection sectionTitle="Business Details">
        <div class="d-flex justifi-content-between">
          <div style={{ flex: '50%' }}>
            <DetailItem title="ID" value={this.business.id} />
            <DetailItem title="Tax ID" value={this.business.tax_id} />
            <DetailItem title="Industry" value={this.business.industry} />
            <DetailItem
              title="Legal Address"
              value={this.formatAddress(this.business.legal_address)}
            />
            <DetailItem title="Website" value={this.business.website_url} />
            <DetailItem title="Phone" value={this.business.phone} />
            <DetailItem title="Email" value={this.business.email} />
          </div>
          <div style={{ flex: '50%' }}>
            <DetailItem
              title="Business Structure"
              value={this.business.business_structure}
            />
            <DetailItem
              title="Business Type"
              value={this.business.business_type}
            />
            <DetailItem
              title="Created"
              value={formatDate(this.business.created_at)}
            />
            <DetailItem
              title="Last Updated"
              value={formatDate(this.business.updated_at)}
            />
          </div>
        </div>
      </DetailSection>
    );
  }
}
