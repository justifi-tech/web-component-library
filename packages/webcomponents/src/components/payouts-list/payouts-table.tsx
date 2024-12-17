import { h } from '@stencil/core';
import { convertToLocal, formatCurrency } from '../../utils/utils';
import { MapPayoutStatusToBadge } from './payouts-status';

export const defaultColumnsKeys = 'created_at,amount,status,payments_total,refunds_total,fees_total,other_total,csv';

export const payoutTableColumns = {
  created_at: () => (
    <th part="table-head-cell" scope="col" title="The date the payout was deposited">
      Created
    </th>
  ),
  sub_account_name: () => (
    <th part="table-head-cell" scope="col" title="The sub account associated with the payout">
      Sub Account
    </th>
  ),
  payments_total: () => (
    <th part="table-head-cell" scope="col" title="The total payments amount associated with the payout">
      Payments
    </th>
  ),
  refunds_total: () => (
    <th part="table-head-cell" scope="col" title="The total refunds amount associated with the payout">
      Refunds
    </th>
  ),
  fees_total: () => (
    <th part="table-head-cell" scope="col" title="The total fees amount associated with the payout">
      Fees
    </th>
  ),
  other_total: () => (
    <th part="table-head-cell" scope="col" title="The total other amount">
      Other
    </th>
  ),
  amount: () => (
    <th part="table-head-cell" scope="col" title="The total amount of the payout">
      Amount
    </th>
  ),
  status: () => (
    <th part="table-head-cell" scope="col" title="The real-time status of each payout">
      Status
    </th>
  ),
  csv: () => (
    <th part="table-head-cell" scope="col" title="Export CSV"/>
  ),
};

export const payoutTableCells = (downloadCSV) => ({
  created_at: (value) => (
    <td part="table-cell">
      <div class="fw-bold">{convertToLocal(value, {showDisplayDate: true})} </div>
    </td>
  ),
  sub_account_name: (value) => (<td part="table-cell">{value}</td>),
  payments_total: (value) => (<td part="table-cell">{formatCurrency(value)}</td>),
  refunds_total: (value) => (<td part="table-cell">{formatCurrency(value)}</td>),
  fees_total: (value) => (<td part="table-cell">{formatCurrency(value)}</td>),
  other_total: (value) => (<td part="table-cell">{formatCurrency(value)}</td>),
  amount: (value) => (<td part="table-cell">{formatCurrency(value)}</td>),
  status: (value) => (<td part="table-cell" innerHTML={MapPayoutStatusToBadge(value)}></td>),
  csv: (value) => (
    <td part="table-cell">
      <a href="#" onClick={(event) => { event.preventDefault(); downloadCSV(value); }}>
        CSV
      </a>
    </td>
  ),
});
