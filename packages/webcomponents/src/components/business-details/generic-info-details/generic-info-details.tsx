import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { IBusiness } from '../../../api/Business';
import { snakeCaseToHumanReadable } from '../../../utils/utils';

@Component({
  tag: 'generic-info-details',
  styleUrl: 'generic-info-details.scss',
  shadow: true,
})
export class GenericInfoDetails {
  @Prop() business: IBusiness;

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Business Generic Info Details">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              {this.business?.legal_name && (
                <DetailItem title="Legal Name" value={this.business.legal_name} />
              )}
              {this.business?.doing_business_as && (
                <DetailItem
                  title="Doing Business As (DBA)"
                  value={this.business.doing_business_as}
                />
              )}
              {this.business?.business_type && (
                <DetailItem
                  title="Business Type"
                  value={snakeCaseToHumanReadable(this.business.business_type)}
                />
              )}
              {this.business?.business_structure && (
                <DetailItem
                  title="Business Structure"
                  value={snakeCaseToHumanReadable(this.business.business_structure)}
                />
              )}
              {this.business?.industry && (
                <DetailItem title="Industry" value={this.business.industry} />
              )}
            </div>
            <div class="col-12 col-md-6">
              {this.business?.tax_id && (
                <DetailItem title="Tax ID" value={this.business.tax_id} />
              )}
              {this.business?.website_url && (
                <DetailItem
                  title="Website URL"
                  value={this.business.website_url}
                />
              )}
              {this.business?.email && (
                <DetailItem title="Email Address" value={this.business.email} />
              )}
              {this.business?.phone && (
                <DetailItem title="Phone Number" value={this.business.phone} />
              )}
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}
