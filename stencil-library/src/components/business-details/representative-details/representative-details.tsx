import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { formatMediumDate } from '../../../utils/utils';
import { Identity } from '../../../api/Business';

/**
 *
 * @exportedPart detail-section
 * @exportedPart detail-section-title
 * @exportedPart detail-section-item-title
 * @exportedPart detail-section-item-data
 * @exportedPart detail-empty-state
 */
@Component({
  tag: 'representative-details',
  styleUrl: 'representative-details.scss',
  shadow: true,
})
export class JustifiRepresentativeDetails {
  @Prop() representative: Identity;

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Representative Details">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem title="Name" value={this.representative?.name} />
              <DetailItem title="ID" value={this.representative?.id} />
              <DetailItem
                title="Representative Address"
                value={this.representative?.address.line1}
              />
              <DetailItem
                title="Created At"
                value={this.representative?.created_at && formatMediumDate(this.representative?.created_at)}
              />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem title="Title" value={this.representative?.title} />
              <DetailItem
                title="Is Owner?"
                value={this.representative?.is_owner.toString()}
              />
              <DetailItem
                title="Date Of Birth"
                value={this.representative && formatMediumDate(
                  new Date(
                    Number(this.representative?.dob_year),
                    Number(this.representative?.dob_month) - 1,
                    Number(this.representative?.dob_day)
                  ),
                )}
              />
              <DetailItem title="Email" value={this.representative?.email} />
              <DetailItem title="Phone" value={this.representative?.phone} />
              <DetailItem
                title="Updated At"
                value={this.representative && formatMediumDate(this.representative?.updated_at)}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}
