import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { IBusiness } from '../../../api/Business';
import {
  formatAddress,
  formatMediumDate,
  snakeCaseToHumanReadable,
} from '../../../utils/utils';

/**
 *
 * @exportedPart detail-section
 * @exportedPart detail-section-title
 * @exportedPart detail-section-item-title
 * @exportedPart detail-section-item-data
 * @exportedPart detail-empty-state
 */
@Component({
  tag: 'business-details-section',
  styleUrl: 'business-details-section.scss',
  shadow: true,
})
export class BusinessDetailsSection {
  @Prop() business: IBusiness;

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Business Details">
          <div class="d-flex justifi-content-between">
            <div style={{ flex: '50%' }}>
              <DetailItem title="ID" value={this.business?.id} />
              <DetailItem title="Tax ID" value={this.business.tax_id} />
              <DetailItem title="Industry" value={this.business.industry} />
              <DetailItem
                title="Legal Address"
                value={formatAddress(this.business.legal_address)}
              />
              <DetailItem title="Website" value={this.business.website_url} />
              <DetailItem title="Phone" value={this.business.phone} />
              <DetailItem title="Email" value={this.business.email} />
            </div>
            <div style={{ flex: '50%' }}>
              <DetailItem
                title="Business Structure"
                value={snakeCaseToHumanReadable(
                  this.business.business_structure,
                )}
              />
              <DetailItem
                title="Business Type"
                value={snakeCaseToHumanReadable(this.business.business_type)}
              />
              <DetailItem
                title="Created"
                value={formatMediumDate(this.business.created_at)}
              />
              <DetailItem
                title="Last Updated"
                value={formatMediumDate(this.business.updated_at)}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}
