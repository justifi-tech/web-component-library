import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { Address } from '../../../api/Business';

@Component({
  tag: 'legal-address-details',
  styleUrl: 'legal-address-details.scss',
  shadow: true,
})
export class LegalAddressDetails {
  @Prop() legalAddress: Address;

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Business Legal Address Details">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem
                title="Legal Address"
                value={this.legalAddress?.line1}
              />
              <DetailItem
                title="Address Line 2"
                value={this.legalAddress?.line2}
              />
              <DetailItem title="City" value={this.legalAddress?.city} />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem title="State" value={this.legalAddress?.state} />
              <DetailItem
                title="Postal Code"
                value={this.legalAddress?.postal_code?.toString()}
              />
              <DetailItem title="Country" value={this.legalAddress?.country} />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}