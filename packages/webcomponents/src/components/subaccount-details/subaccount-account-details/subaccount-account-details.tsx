import { Component, Host, Prop, h } from '@stencil/core';
import { IOnboardingData, SubAccount } from '../../../api/SubAccount';
import { DetailItem, DetailSectionTitle } from '../../details/utils';

@Component({
  tag: 'subaccount-account-details',
  styleUrl: 'subaccount-account-details.scss',
  shadow: true,
})
export class SubaccountAccountDetails {
  @Prop() subaccount: SubAccount
  @Prop() onboardingData: IOnboardingData

  render() {
    return (
      <Host>
        <div class='p-2'>
          <DetailSectionTitle sectionTitle='Account Details' />
          <div class="d-table gap-2 w-100">
            <div class="row gy-3">
              <div class="col-12 col-md-6">
                <DetailItem title='Name' value={this.subaccount?.name} />
                <DetailItem
                  title='Terms of Service Accepted'
                  value={this.onboardingData?.payload?.terms_and_conditions.accepted.toString()}
                />
                <DetailItem title='Business Entity' value={'something here'} />
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
