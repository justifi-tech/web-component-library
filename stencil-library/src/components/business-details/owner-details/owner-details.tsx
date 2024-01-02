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
  tag: 'owner-details',
  styleUrl: 'owner-details.scss',
  shadow: true,
})
export class OwnerDetails {
  @Prop() owners: Identity[];

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Owner Details">
          <div class="row">
            {!!this?.owners.length ? (
              this.owners.map(owner => (
                <div>
                  <div class="col-12 col-md-6">
                    <DetailItem title="Name" value={owner.name} />
                    <DetailItem title="Title" value={owner.title} />
                    <DetailItem title="Email" value={owner.email} />
                    <DetailItem title="Phone" value={owner.phone} />
                    <DetailItem
                      title="Date of Birth"
                      value={formatMediumDate(
                        new Date(
                          Number(owner.dob_day),
                          Number(owner.dob_month),
                          Number(owner.dob_year),
                        ),
                      )}
                    />

                    <DetailItem
                      title="Identification Number"
                      value={`********${owner.ssn_last4}`}
                    />
                  </div>
                  <DetailSection sectionTitle="Owner Address">
                    <div class="row gy-3">
                      <div class="col-12 col-md-6">
                        <DetailItem
                          title="Line 1"
                          value={owner.address.line1}
                        />
                        <DetailItem
                          title="Line 2"
                          value={owner.address.line2}
                        />
                        <DetailItem title="City" value={owner.address.city} />
                        <DetailItem title="State" value={owner.address.state} />
                        <DetailItem
                          title="Zip"
                          value={owner.address.postal_code}
                        />
                      </div>
                    </div>
                  </DetailSection>
                </div>
              ))
            ) : (
              <DetailItem title="No owners" value="" />
            )}
          </div>
        </DetailSection>
      </Host>
    );
  }
}
