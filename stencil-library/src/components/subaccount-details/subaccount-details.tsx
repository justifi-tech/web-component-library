import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponse } from '../../api';
import { SubAccountOnboardingData } from '../../api/SubAccount';
import { MockOnboardingData } from '../../api/mockData/MockOnboardingData';

@Component({
  tag: 'justifi-subaccount-details',
  styleUrl: 'subaccount-details.scss',
  shadow: true,
})

export class SubaccountDetails {
  @Prop() accountId: string;
  @Prop() subId: string;
  @Prop() authToken: string;
  @State() subaccount: SubAccountOnboardingData = MockOnboardingData;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('subId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const api = Api(this.authToken, process.env.ACCOUNTS_API_ORIGIN);
    const endpoint = `onboarding/${this.subId}`;


    const response: IApiResponse<SubAccountOnboardingData> = await api.get(endpoint);
    if (!response.error) {
      this.subaccount = response.data;
      console.log(this.subaccount);
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }
    this.loading = false;
  }

  render() {
    return (
      <Host>
        <subaccount-business-details data={this.subaccount?.payload.business_details} />
        <subaccount-representative-details data={this.subaccount?.payload.representative} />
        <subaccount-owners-details data={this.subaccount?.payload.owners} />
        <subaccount-bank-details data={this.subaccount?.payload.bank_account} />
        <subaccount-terms-details data={this.subaccount?.payload.terms_and_conditions} />
      </Host>
    );
  }

}
