import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSection } from '../../details/utils';
import { SubAccountBusinessDetails } from '../../../api/SubAccount';

@Component({
  tag: 'subaccount-business-details',
  styleUrl: 'subaccount-business-details.scss',
  shadow: true,
})

export class SubaccountBusinessDetails {
  @Prop() data: SubAccountBusinessDetails

  render() {
    return (
      <Host>
        <DetailSection sectionTitle='Subaccount Business Details' >
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem
                title="Business Website"
                value={this.data?.url}
              />
              <DetailItem
                title="Industry"
                value={this.data?.industry}
              />
              <DetailItem
                title="Business Type"
                value={this.data?.type}
              />
              <DetailItem
                title="Business Structure"
                value={this.data?.structure}
              />
              <DetailItem 
                title="Tax ID" 
                value={this.data?.tax_id} 
              />
              <DetailItem
                title="Phone"
                value={this.data?.phone}
              />
              <DetailItem
                title="Email"
                value={this.data?.email}
              />
              <DetailItem
                title="Date of Incorporation"
                value={this.data?.date_of_incorporation}
              />
              <DetailItem
                title="Approximate Annual Volume"
                value={this.data?.approximate_annual_volume}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }

}
