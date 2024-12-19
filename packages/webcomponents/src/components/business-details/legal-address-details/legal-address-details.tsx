import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../../ui-components/details/utils';
import { IAddress } from '../../../api/Business';
import { isEmptyObject } from '../../../utils/utils';

@Component({
  tag: 'legal-address-details',
})
export class LegalAddressDetails {
  @Prop() legalAddress: IAddress;

  render() {
    if (isEmptyObject(this.legalAddress)) return null;

    return (
      <Host>
        <DetailSectionTitle sectionTitle="Business Legal Address Details" />
        <div class="d-table gap-2 w-100 mt-3">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem title="Country" value={this.legalAddress?.country} />
              <DetailItem
                title="Legal Address"
                value={this.legalAddress?.line1}
              />
              <DetailItem
                title="Address Line 2"
                value={this.legalAddress?.line2}
              />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem title="City" value={this.legalAddress?.city} />
              <DetailItem title="State" value={this.legalAddress?.state} />
              <DetailItem
                title="Postal Code"
                value={this.legalAddress?.postal_code?.toString()}
              />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
