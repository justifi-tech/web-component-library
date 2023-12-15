import { Component, Host, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';
import { SubAccount } from '../../api/SubAccount';
import { MapSubAccountStatusToBadge } from '../../utils/utils';
import { Api, IApiResponseCollection, PagingInfo, pagingDefaults } from '../../api';

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
  @State() params: any;
  @Event({
    eventName: 'subaccount-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<SubAccount>;


  @Watch('accountId')
  @Watch('authToken')
  @Watch('params')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  handleClickPrevious = (beforeCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.after_cursor;
    this.params = ({ ...newParams, before_cursor: beforeCursor });
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.before_cursor;
    this.params = ({ ...newParams, after_cursor: afterCursor });
  };

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const api = Api(this.authToken, process.env.PRIVATE_API_ORIGIN);
    const endpoint = `account/${this.accountId}/seller_accounts`;


    const response: IApiResponseCollection<SubAccount[]> = await api.get(endpoint, this.params);
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info
      }
      const data = response?.data.map(dataItem => new SubAccount(dataItem));
      this.subaccounts = data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }
    this.loading = false;
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
                  value: MapSubAccountStatusToBadge(subaccount.status)
                }
              ]
            ))
          }
          loading={this.loading}
          error-message={this.errorMessage}
          params={this.params}
          paging={{
            ...this.paging,
            handleClickNext: this.handleClickNext,
            handleClickPrevious: this.handleClickPrevious
          }}
        />
      </Host>
    );
  }
}
