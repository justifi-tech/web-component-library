import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../../ui-components/details/utils';
import { IBusiness } from '../../../api/Business';
import { snakeCaseToHumanReadable } from '../../../utils/utils';

@Component({
  tag: 'generic-info-details',
  styleUrl: '../shared-business-details.css',
})
export class GenericInfoDetails {
  @Prop() business: IBusiness;

  render() {
    if (!this.business) return null;

    return (
      <Host>
        <DetailSectionTitle sectionTitle="Business Generic Info Details" />
        <div class="d-table gap-2 w-100 mt-3" part="detail-section-block">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem title="Legal Name" value={this.business?.legal_name} />
              <DetailItem
                title="Doing Business As (DBA)"
                value={this.business?.doing_business_as}
              />
              <DetailItem
                title="Business Classification"
                value={snakeCaseToHumanReadable(this.business?.classification)}
              />
              <DetailItem title="Industry" value={this.business?.industry} />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem title="Tax ID" value={this.business?.tax_id} />
              <DetailItem
                title="Website URL"
                value={this.business?.website_url}
              />
              <DetailItem title="Email Address" value={this.business?.email} />
              <DetailItem title="Phone Number" value={this.business?.phone} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
