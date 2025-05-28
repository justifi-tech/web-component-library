import { Component, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../../ui-components/details/utils';
import { Business } from '../../../api/Business';
import { snakeCaseToHumanReadable } from '../../../utils/utils';

@Component({
  tag: 'core-info-details',
})
export class CoreInfoDetails {
  @Prop() business: Business;

  render() {
    if (!this.business) {
      return null;
    };

    return (
      <div>
        <DetailSectionTitle sectionTitle="Business Core Info Details" />
        <div class="d-table gap-2 w-100 mt-3">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem title="Legal Name" value={this.business.legal_name} />
              <DetailItem
                title="Doing Business As (DBA)"
                value={this.business.doing_business_as}
              />
              <DetailItem
                title="Business Classification"
                value={snakeCaseToHumanReadable(this.business.classification)}
              />
              <DetailItem title="Industry" value={this.business.industry} />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem title="Tax ID" value={this.business.tax_id} />
              <DetailItem
                title="Website URL"
                value={this.business.website_url}
              />
              <DetailItem title="Email Address" value={this.business.email} />
              <DetailItem title="Phone Number" value={this.business.phone} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
