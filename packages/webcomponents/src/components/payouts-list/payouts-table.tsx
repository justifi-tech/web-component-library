import { h } from '@stencil/core';
import { MapPayoutStatusToBadge } from './payouts-status';

export const defaultColumnsKeys = 'created_at,payments_total,refunds_total,fees_total,other_total,amount,status';

export const payoutsTableColumns = {
  created_at: () => (
    <th part="table-head-cell" scope="col" title="The date the payout was created">
      Date
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
};

export const payoutsTableCells = {
  created_at: (value) => (<td>{value}</td>),
  sub_account_name: (value) => (<td>{value}</td>),
  payments_total: (value) => (<td>{value}</td>),
  refunds_total: (value) => (<td>{value}</td>),
  fees_total: (value) => (<td>{value}</td>),
  other_total: (value) => (<td>{value}</td>),
  amount: (value) => (<td>{value}</td>),
  status: (value) => (<td innerHTML={MapPayoutStatusToBadge(value)}></td>),
};
