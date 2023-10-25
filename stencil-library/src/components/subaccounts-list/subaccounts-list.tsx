import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { SubAccount } from '../../api/SubAccount';
import { MapPaymentStatusToBadge } from '../../utils/utils';
import { PagingInfo, pagingDefaults } from '../table/table-utils';

@Component({
  tag: 'justifi-subaccounts-list',
  styleUrl: 'subaccounts-list.css',
  shadow: true,
})
export class SubaccountsList {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() subaccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @Event({
    eventName: 'subaccount-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<SubAccount>;

  onPageChange = (direction: string) => {
    return () => {
      this.fetchData(direction);
    }
  }

  fetchData(direction?: string) {
    console.log(direction);
  }

  render() {
    return (
      <Host>
        <justifi-table
          rowClickHandler={e => {
            const clickSubAccountId = e.target.closest('tr').dataset.rowEntityId;
            if (!clickSubAccountId) { return }
            this.rowClicked.emit(this.subaccounts.find((subaccount) => subaccount.id === clickSubAccountId));
          }}
          entityId={this.subaccounts.map((subaccount) => subaccount.id)}
          columnData={[
            ['Created On', 'The date and time each sub account was created'],
            ['Name', 'The name provided for each sub account'],
            ['Account	', 'The unique live or test account ID for each sub account'],
            ['Card Rate	', 'The rate that determines the fees charged per payment, when paid by card'],
            ['ACH Rate	', 'The rate that determines the fees charged per payment, when paid by eCheck'],
            ['Status', 'The onboarding status of each sub account']
          ]}
          rowData={
            this.subaccounts.map((subaccount) => (
              [
                {
                  type: 'head',
                  value: `
                    <div>${subaccount.dateString}</div>
                    <div>${subaccount.timeString}</div>
                  `,
                },
                subaccount.name,
                subaccount.id,
                subaccount.cardRate,
                subaccount.achRate,
                {
                  type: 'inner',
                  value: MapPaymentStatusToBadge(subaccount.status)
                }
              ]
            ))
          }
          loading={this.loading}
          error-message={this.errorMessage}
          paging={{
            ...this.paging,
            onPrev: this.onPageChange('prev'),
            onNext: this.onPageChange('next')
          }}
        />
      </Host>
    );
  }
}
