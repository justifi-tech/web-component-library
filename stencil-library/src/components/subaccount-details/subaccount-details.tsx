import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponse } from '../../api';
import { SubAccount } from '../../api/SubAccount';
import { DetailItem, DetailSection } from '../details/utils';

@Component({
  tag: 'justifi-subaccount-details',
  styleUrl: 'subaccount-details.css',
  shadow: true,
})

export class SubaccountDetails {
  @Prop() accountId: string;
  @Prop() subAccountId: string;
  @Prop() authToken: string;
  @State() subaccount: SubAccount
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('subAccountId')
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
    const api = Api(this.authToken, process.env.PRIVATE_API_ORIGIN);
    const endpoint = `account/${this.accountId}/seller_accounts/${this.subAccountId}`;


    const response: IApiResponse<SubAccount> = await api.get(endpoint);
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
        <DetailSection sectionTitle='Details'>
          <DetailItem title='Test' value='Value' />
          <DetailItem title='Test' value='Value' />
          <DetailItem title='Test' value='Value' />
          <DetailItem title='Test' value='Value' />
        </DetailSection>
      </Host>
    );
  }

}
