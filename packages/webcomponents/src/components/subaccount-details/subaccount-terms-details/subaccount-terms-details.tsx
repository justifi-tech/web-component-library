import { Component, Host, Prop, h } from '@stencil/core';
import { Terms } from '../../../api/SubAccount';
import { DetailItem, DetailSection } from '../../details/utils';

@Component({
  tag: 'subaccount-terms-details',
  styleUrl: 'subaccount-terms-details.scss',
  shadow: true,
})
export class SubaccountTermsDetails {
  @Prop() data: Terms

  render() {
    return (
      <Host>
        <DetailSection sectionTitle='Terms and Conditions'>
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem
                title="IP"
                value={this.data?.ip}
              />
              <DetailItem
                title="Accepted?"
                value={this.data?.accepted?.toString()}
              />
              <DetailItem
                title="User Agent"
                value={this.data?.user_agent}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}
