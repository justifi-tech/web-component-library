import { Component, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { Address, IBusiness } from '../../../api/Business';
import { formatDate } from '../../../utils/utils';

@Component({
  tag: 'owner-details-section',
  styleUrl: 'owner-details-section.scss',
  shadow: true,
})
export class OwnerDetailsSection {
  @Prop() business: IBusiness;

  formatAddress(address: Address): string {
    return `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`;
  }

  render() {
    return (
      <DetailSection sectionTitle="Owner Details">
        {!!this.business.owners.length ? (
          this.business.owners.map(owner => (
            <div>
              <DetailItem title="Name" value={owner.name} />
              <DetailItem title="Title" value={owner.title} />
              <DetailItem title="Email" value={owner.email} />
              <DetailItem title="Phone" value={owner.phone} />
              <DetailItem
                title="Date of Birth"
                value={formatDate(
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

              <DetailSection sectionTitle="Owner Address">
                <DetailItem title="Line 1" value={owner.address.line1} />
                <DetailItem title="Line 2" value={owner.address.line2} />
                <DetailItem title="City" value={owner.address.city} />
                <DetailItem title="State" value={owner.address.state} />
                <DetailItem title="Zip" value={owner.address.postal_code} />
              </DetailSection>
            </div>
          ))
        ) : (
          <DetailItem title="No owners" value="" />
        )}
      </DetailSection>
    );
  }
}
