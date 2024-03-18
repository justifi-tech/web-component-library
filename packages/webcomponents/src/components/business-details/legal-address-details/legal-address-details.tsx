import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSectionTitle, DetailItem } from '../../details/utils';
import { IAddress } from '../../../api/Business';

@Component({
  tag: 'legal-address-details',
  styleUrl: 'legal-address-details.scss',
  shadow: true,
})
export class LegalAddressDetails {
  @Prop() legalAddress: IAddress;

  render() {
    return (
      <Host>
        <DetailSectionTitle sectionTitle="Business Legal Address Details" />
        <div class="d-table gap-2 w-100">
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
        </div>
      </Host>
    );
  }
}
