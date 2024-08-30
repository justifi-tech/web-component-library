import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../details/utils';
import { IOnboardingData } from '../../../components';
import { formatLegalAddress } from '../../../utils/utils';

@Component({
  tag: 'subaccount-merchant-details',
})
export class SubaccountMerchantDetails {
  @Prop() onboardingData: IOnboardingData;

  render() {
    return (
      <Host>
        <div class='p-2'>
          <DetailSectionTitle sectionTitle='Merchant Details' />
          <div class="d-table gap-2 w-100">
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
                  value={this.onboardingData?.payload?.business_details?.legal ? `${formatLegalAddress(this.onboardingData?.payload?.business_details?.legal)}` : ''}
                />
              </div>
              <div class="col-12 col-md-6">
                <DetailItem
                  title='Business Type'
                  value={this.onboardingData?.payload?.business_details?.type}
                />
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
