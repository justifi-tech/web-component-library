import { Component, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { Address, IBusiness } from '../../../api/Business';
import { formatDate } from '../../../utils/utils';

@Component({
  tag: 'representative-details-section',
  styleUrl: 'representative-details-section.scss',
  shadow: true,
})
export class RepresentativeDetailsSection {
  @Prop() business: IBusiness;

  formatAddress(address: Address): string {
    return `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`;
  }

  render() {
    return (
      <DetailSection sectionTitle="Representative Details">
        <div class="d-flex justifi-content-between">
          <div style={{ flex: '50%' }}>
            <DetailItem
              title="Name"
              value={this.business.representative.name}
            />
            <DetailItem title="ID" value={this.business.representative.id} />
            <DetailItem
              title="Representative Address"
              value={this.business.representative.address.line1}
            />
            <DetailItem
              title="Representative Created At"
              value={this.business.representative.created_at}
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
              value={formatDate(
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
              value={formatDate(
                new Date(this.business.representative.updated_at),
              )}
            />
          </div>
        </div>
      </DetailSection>
    );
  }
}
