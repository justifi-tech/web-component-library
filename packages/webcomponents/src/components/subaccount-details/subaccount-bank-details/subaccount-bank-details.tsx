import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSection } from '../../details/utils';
import { SubaccountBankAccount } from '../../../api/SubAccount';

@Component({
  tag: 'subaccount-bank-details',
  styleUrl: 'subaccount-bank-details.scss',
  shadow: true,
})
export class SubaccountBankDetails {
  @Prop() data: SubaccountBankAccount

  render() {
    return (
      <Host>
        <DetailSection sectionTitle='Bank Account Details'>
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem
                title="Bank Name"
                value={this.data?.bank_name}
              />
              <DetailItem
                title="Account Type"
                value={this.data?.account_type}
              />
              <DetailItem
                title="Account Number"
                value={this.data?.account_number}
              />
              <DetailItem
                title="Routing Number"
                value={this.data?.routing_number}
              />
              <DetailItem
                title="Account Nickname"
                value={this.data?.account_nickname}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }

}
