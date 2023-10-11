import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { IBusiness } from '../../../api/Business';
import { formatMediumDate } from '../../../utils/utils';

/**
 *
 * @exportedPart detail-section
 * @exportedPart detail-section-title
 * @exportedPart detail-section-item-title
 * @exportedPart detail-section-item-data
 * @exportedPart detail-empty-state
 */
@Component({
  tag: 'representative-details-section',
  styleUrl: 'representative-details-section.scss',
  shadow: true,
})
export class RepresentativeDetailsSection {
  @Prop() business: IBusiness;

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Representative Details">
          <div class="d-flex justifi-content-between">
            <div style={{ flex: '50%' }}>
              <DetailItem
                title="Name"
                value={this.business?.representative.name}
              />
              <DetailItem title="ID" value={this.business.representative.id} />
              <DetailItem
                title="Representative Address"
                value={this.business.representative.address.line1}
              />
              <DetailItem
                title="Representative Created At"
                value={formatMediumDate(
                  this.business.representative.created_at,
                )}
              />
            </div>
            <div style={{ flex: '50%' }}>
              <DetailItem
                title="Title"
                value={this.business.representative.title}
              />
              <DetailItem
                title="Is Owner?"
                value={this.business.representative.is_owner.toString()}
              />
              <DetailItem
                title="Date Of Birth"
                value={formatMediumDate(
                  new Date(
                    Number(this.business.representative.dob_day),
                    Number(this.business.representative.dob_month) - 1,
                    Number(this.business.representative.dob_year),
                  ),
                )}
              />
              <DetailItem
                title="Email"
                value={this.business.representative.email}
              />
              <DetailItem
                title="Phone"
                value={this.business.representative.phone}
              />
              <DetailItem
                title="Representative Updated At"
                value={formatMediumDate(
                  new Date(this.business.representative.updated_at),
                )}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}
