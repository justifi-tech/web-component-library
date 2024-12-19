import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../../ui-components/details/utils';
import { formatMediumDate } from '../../../utils/utils';
import { Identity } from '../../../api/Identity';

@Component({
  tag: 'owner-details',
})
export class OwnerDetails {
  @Prop() owners: Identity[];

  render() {
    if (!this?.owners?.length) return null;

    return (
      <Host>
        {!!this?.owners.length && (
          this.owners.map(owner => [
            <DetailSectionTitle sectionTitle={`Owner ${owner?.name}'s Details`} />,
            <div class="d-table gap-2 w-100 mt-3">
              <DetailItem title="Name" value={owner?.name} />
              <DetailItem title="Title" value={owner?.title} />
              <DetailItem title="Email" value={owner?.email} />
              <DetailItem title="Phone" value={owner?.phone} />
              <DetailItem
                title="Date of Birth"
                value={formatMediumDate(
                  new Date(
                    Number(owner?.dob_day),
                    Number(owner?.dob_month),
                    Number(owner?.dob_year),
                  ),
                )}
              />

              <DetailItem
                title="Identification Number"
                value={`********${owner?.ssn_last4}`}
              />
              <DetailItem
                title="Line 1"
                value={owner?.address?.line1}
              />
              <DetailItem
                title="Line 2"
                value={owner?.address?.line2}
              />
              <DetailItem
                title="City"
                value={owner?.address?.city}
              />
              <DetailItem title="State" value={owner?.address?.state} />
              <DetailItem
                title="Zip"
                value={owner?.address?.postal_code}
              />
            </div>
          ])
        )}
      </Host>
    );
  }
}
