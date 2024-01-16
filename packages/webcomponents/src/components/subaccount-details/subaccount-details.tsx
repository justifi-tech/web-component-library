import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponse } from '../../api';
import { IOnboardingData, ISubAccount, SubAccount } from '../../api/SubAccount';
import { EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';
import { MapSubAccountStatusToBadge, formatDate, formatTime } from '../../utils/utils';
import { config } from '../../../config';

@Component({
  tag: 'justifi-subaccount-details',
  styleUrl: 'subaccount-details.scss',
  shadow: true,
})

export class SubaccountDetails {
  @Prop() accountId: string;
  @Prop() subaccountId: string;
  @Prop() authToken: string;
  @State() onboardingData: IOnboardingData;
  @State() subaccount: SubAccount;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('subaccountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchOnboardingData(): Promise<void> {
    const api = Api(this.authToken, '');
    const endpoint = `onboarding/${this.subaccountId}`;

    const response: IApiResponse<IOnboardingData> = await api.get(endpoint);
    if (!response.error) {
      this.onboardingData = response.data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }
  }

  async fetchSubAccountData(): Promise<void> {
    const api = Api(this.authToken, config.privateApiOrigin);
    const endpoint = `account/${this.accountId}/seller_accounts/${this.subaccountId}`;

    const response: IApiResponse<ISubAccount> = await api.get(endpoint);
    if (!response.error) {
      const data = new SubAccount(response.data);
      this.subaccount = data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }
  }

  async fetchData(): Promise<void> {
    this.loading = true;
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.fetchSubAccountData();
    this.fetchOnboardingData();
    this.loading = false;
  }

  render() {
    return (
      <Host>
        {this.loading && LoadingState}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && this.subaccount && this.onboardingData && (
          <justifi-details>
            <EntityHeadInfo
              slot='head-info'
              badge={<span slot='badge' innerHTML={MapSubAccountStatusToBadge(this.subaccount.status)} />}
              title={this.subaccount.name}>
              <EntityHeadInfoItem
                classes="border-1 border-end"
                title="Created At"
                value={`${formatDate(this.subaccount.created_at)} ${formatTime(this.subaccount.created_at)}`}
              />
              <EntityHeadInfoItem
                classes="border-1 border-end"
                title="Last Updated"
                value={`${formatDate(this.subaccount.updated_at)} ${formatTime(this.subaccount.updated_at)}`}
              />
              <EntityHeadInfoItem title="ID" value={this.subaccount.id} />
            </EntityHeadInfo>
            <div slot='detail-sections'>
              <subaccount-account-details subaccount={this.subaccount} onboardingData={this.onboardingData} />
              <subaccount-merchant-details onboardingData={this.onboardingData} />
              <subaccount-representative-details data={this.onboardingData.payload?.representative} />
              <subaccount-owners-details data={this.onboardingData.payload?.owners} />
            </div>
          </justifi-details>
        )}
      </Host>
    );
  }
}
