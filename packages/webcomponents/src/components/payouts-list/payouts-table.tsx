import { h } from '@stencil/core';
import { formatDate, formatCurrency } from '../../utils/utils';
import { MapPayoutStatusToBadge } from './payouts-status';

export const defaultColumnsKeys = 'deposits_at,sub_account_name,amount,status,payments_total,refunds_total,fees_total,other_total,csv';

export const payoutTableColumns = {
  deposits_at: () => (
    <th part="table-head-cell" scope="col" title="The date the payout was deposited">
      Deposited
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
  deposits_at: (value) => (
    <td>
      <div class="fw-bold">{formatDate(value)} </div>
    </td>
  ),
  sub_account_name: (value) => (<td>{value}</td>),
  payments_total: (value) => (<td>{formatCurrency(value)}</td>),
  refunds_total: (value) => (<td>{formatCurrency(value)}</td>),
  fees_total: (value) => (<td>{formatCurrency(value)}</td>),
  other_total: (value) => (<td>{formatCurrency(value)}</td>),
  amount: (value) => (<td>{formatCurrency(value)}</td>),
  status: (value) => (<td innerHTML={MapPayoutStatusToBadge(value)}></td>),
  csv: (value) => (
    console.log('value', value),
    <td>
      <a href="#" onClick={(event) => { event.preventDefault(); downloadCSV(value); }}>
        CSV
      </a>
    </td>
  ),
});
