import { h } from '@stencil/core';
import { convertToLocal, formatCurrency } from '../../utils/utils';
import { MapPayoutStatusToBadge } from './payouts-status';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';

export const defaultColumnsKeys = 'created_at,amount,status,payments_total,refunds_total,fees_total,other_total,csv';

export const payoutTableColumns = {
  created_at: () => (
    <th part={tableHeadCell} scope="col" title="The date the payout was deposited">
      Created
    </th>
  ),
  sub_account_name: () => (
    <th part={tableHeadCell} scope="col" title="The sub account associated with the payout">
      Sub Account
    </th>
  ),
  payments_total: () => (
    <th part={tableHeadCell} scope="col" title="The total payments amount associated with the payout">
      Payments
    </th>
  ),
  refunds_total: () => (
    <th part={tableHeadCell} scope="col" title="The total refunds amount associated with the payout">
      Refunds
    </th>
  ),
  fees_total: () => (
    <th part={tableHeadCell} scope="col" title="The total fees amount associated with the payout">
      Fees
    </th>
  ),
  other_total: () => (
    <th part={tableHeadCell} scope="col" title="The total other amount">
      Other
    </th>
  ),
  amount: () => (
    <th part={tableHeadCell} scope="col" title="The total amount of the payout">
      Amount
    </th>
  ),
  status: () => (
    <th part={tableHeadCell} scope="col" title="The real-time status of each payout">
      Status
    </th>
  ),
  csv: () => (
    <th part={tableHeadCell} scope="col" title="Export CSV" />
  ),
};

export const payoutTableCells = (downloadCSV) => ({
  created_at: (value, index) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{convertToLocal(value, { showDisplayDate: true })} </div>
    </td>
  ),
  sub_account_name: (value, index) => (<td part={getAlternateTableCellPart(index)}>{value}</td>),
  payments_total: (value, index) => (<td part={getAlternateTableCellPart(index)}>{formatCurrency(value)}</td>),
  refunds_total: (value, index) => (<td part={getAlternateTableCellPart(index)}>{formatCurrency(value)}</td>),
  fees_total: (value, index) => (<td part={getAlternateTableCellPart(index)}>{formatCurrency(value)}</td>),
  other_total: (value, index) => (<td part={getAlternateTableCellPart(index)}>{formatCurrency(value)}</td>),
  amount: (value, index) => (<td part={getAlternateTableCellPart(index)}>{formatCurrency(value)}</td>),
  status: (value, index) => (<td part={getAlternateTableCellPart(index)}>{MapPayoutStatusToBadge(value)}</td>),
  csv: (value, index) => (
    <td part={getAlternateTableCellPart(index)}>
      <a href="#" onClick={(event) => { event.preventDefault(); downloadCSV(value); }}>
        CSV
      </a>
    </td>
  ),
});
