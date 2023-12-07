import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSection } from '../../details/utils';
import { IOnboardingData } from '../../../components';
import { formatLegalAddress, snakeCaseToHumanReadable } from '../../../utils/utils';

@Component({
  tag: 'subaccount-merchant-details',
  styleUrl: 'subaccount-merchant-details.scss',
  shadow: true,
})
export class SubaccountMerchantDetails {
  @Prop() onboardingData: IOnboardingData;

  render() {
    return (
      <Host>
        <div class='p-2'>
          <DetailSection sectionTitle='Merchant Details'>
            <div class="row gy-3">
              <div class="col-12 col-md-6">
                <DetailItem
                  title='Doing Business As'
                  value={this.onboardingData?.payload?.business_details?.doing_business_as?.name}
                />
                <DetailItem
                  title='Website'
                  value={this.onboardingData?.payload?.business_details?.url}
                />
                <DetailItem
                  title='Business Email'
                  value={this.onboardingData?.payload?.business_details?.email}
                />
                <DetailItem
                  title='Phone Number'
                  value={this.onboardingData?.payload?.business_details?.phone}
                />
                <DetailItem
                  title='Address'
                  value={`${formatLegalAddress(this.onboardingData?.payload?.business_details?.legal)}`}
                />
              </div>
              <div class="col-12 col-md-6">
                <DetailItem
                  title='Business Structure'
                  value={snakeCaseToHumanReadable(this.onboardingData?.payload?.business_details?.structure)}
                  />
                <DetailItem
                  title='Business Type'
                  value={this.onboardingData?.payload?.business_details?.type}
                  />
              </div>
            </div>
          </DetailSection>
        </div>
      </Host>
    );
  }

}
