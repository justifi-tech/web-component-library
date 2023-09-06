import { Component, Host, h, Prop } from '@stencil/core';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { ICard } from '../../api';
import { BankAccount } from '../../api/shared';

interface IEntityProps {
  account_id: string;
  description: string;
  amount: number;
  status: string;
  updated_at: string;
  created_at: string;
  amount_refunded: number;
  fee_amount: number;
  balance: number;
  bank_account: BankAccount;
  payment_method: {
    card: ICard,
    bank_account: BankAccount
  }
  metadata: string;
}

@Component({
  tag: 'justifi-details',
  styleUrl: './details.scss',
  shadow: true,
})

export class Details {
  @Prop() loading: boolean = true;
  @Prop() errorMessage: string;
  @Prop() entity: IEntityProps;

  render() {
    return (
      <Host
        exportParts='detail-loading-spinner,detail-loading-state,detail-empty-state,
        detail-head,detail-title,detail-method,detail-info,detail-info-item,
        detail-info-item-title,detail-info-item-data,detail-metadata,detail-metadata-title,
        detail-method-title,detail-method-data'
      >
        {this.loading ?
          <main part='detail-loading-state' class="p-2 d-flex justify-content-center">
            <div part='detail-loading-spinner' class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </main>
        :
        !this.entity || this.errorMessage ?
          <main part='detail-empty-state' class="p-2 d-flex justify-content-center">
            <div>{this.errorMessage}</div>
          </main>
        :
          <main class="p-2">
            <div part='detail-head' class="p-2">
              {
                this.entity?.description ?
                <h1 part='detail-title'>Payment for {this.entity.description}</h1>
                :
                <h1 part='detail-title'>Payout on {formatDate(this.entity.created_at)}</h1>
              }
              <div class="d-flex flex-row align-items-center gap-2">
                <span class="fs-1">{formatCurrency(this.entity.amount)}</span>
                <span innerHTML={MapPaymentStatusToBadge(this.entity.status)}></span>
              </div>
              <div part="detail-info" class="d-flex flex-row align-items-top gap-4">
                <div part="detail-info-item" class="d-flex flex-column">
                  <span part="detail-info-item-title" class="text-uppercase">Updated</span>
                  <span part="detail-info-item-data">{formatDate(this.entity.updated_at)}</span>
                  <span part="detail-info-item-data">{formatTime(this.entity.updated_at)}</span>
                </div>
                <div part="detail-info-item" class="d-flex flex-column">
                  <span part="detail-info-item-title" class="text-uppercase">Created</span>
                  <span part="detail-info-item-data">{formatDate(this.entity.created_at)}</span>
                  <span part="detail-info-item-data">{formatTime(this.entity.created_at)}</span>
                </div>
                <div part="detail-info-item" class="d-flex flex-column">
                  <span part="detail-info-item-title" class="text-uppercase">Refunded</span>
                  <span part="detail-info-item-data">{formatCurrency(this.entity.amount_refunded)}</span>
                </div>
                <div part="detail-info-item" class="d-flex flex-column">
                  <span part="detail-info-item-title" class="text-uppercase">Fees</span>
                  <span part="detail-info-item-data">{formatCurrency(this.entity.fee_amount)}</span>
                </div>
                <div part="detail-info-item" class="d-flex flex-column">
                  <span part="detail-info-item-title" class="text-uppercase">Balance</span>
                  <span part="detail-info-item-data">{formatCurrency(this.entity.balance)}</span>
                </div>
              </div>
            </div>
            <div part="detail-method" class="mt-4">
              <h2 part="detail-method-title" class="fw-bold fs-5">Payment Method Details</h2>
              <hr/>
              {this.entity?.payment_method?.card ?
                <div class="d-flex flex-row flex-wrap gap-4">
                  <div class="d-flex flex-column">
                    <span part="detail-method-item-title" class="text-uppercase">Card Holder</span>
                    <span part="detail-method-item-data">{this.entity.payment_method.card.name}</span>
                  </div>
                  <div class="d-flex flex-column">
                    <span part="detail-method-item-title" class="text-uppercase">Card Info</span>
                    <span part="detail-method-item-data">{this.entity.payment_method.card.acct_last_four}</span>
                  </div>
                </div>
              : this.entity?.bank_account ?
                <div class="d-flex flex-row flex-wrap gap-4">
                  <div class="d-flex flex-column">
                    <span part="detail-method-item-title" class="text-uppercase">Bank Account Holder</span>
                    <span part="detail-method-item-data">{this.entity.bank_account?.full_name}</span>
                  </div>
                  <div class="d-flex flex-column">
                    <span part="detail-method-item-title" class="text-uppercase">Bank Name</span>
                    <span part="detail-method-item-data">{this.entity.bank_account?.bank_name}</span>
                  </div>
                  <div class="d-flex flex-column">
                    <span part="detail-method-item-title" class="text-uppercase">Account Last 4</span>
                    <span part="detail-method-item-data">{this.entity.bank_account?.account_number_last4}</span>
                  </div>
                </div>
                : null
              }

            </div>
            {this.entity?.metadata && Object.keys(this.entity?.metadata).length ?
              <div class="mt-4">
                <h2 part="detail-metadata-title" class="fw-bold fs-5">Metadata</h2>
                <hr/>
                <pre part="detail-metadata" class="p-2" aria-label="metadata content">
                  <code>
                    {JSON.stringify(this.entity.metadata, null, 2)}
                  </code>
                </pre>
              </div>
              : null
            }
          </main>
        }
      </Host>
    )
  }
}
