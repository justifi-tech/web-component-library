import { h } from '@stencil/core';
import { convertToLocal } from '../../utils/utils';
import { MapPayoutStatusToBadge } from './payouts-status';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { Payout } from '../../api/Payout';

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
  created_at: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{convertToLocal(payout.created_at, { showDisplayDate: true })}</div>
    </td>
  ),
  sub_account_name: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payout.sub_account_name}</td>
  ),
  payments_total: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payout.formatPaymentAmount(payout.payments_total, true)}</td>
  ),
  refunds_total: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payout.formatPaymentAmount(payout.refunds_total, true)}</td>
  ),
  fees_total: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payout.formatPaymentAmount(payout.fees_total, true)}</td>
  ),
  other_total: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payout.formatPaymentAmount(payout.other_total, true)}</td>
  ),
  amount: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payout.formatPaymentAmount(payout.amount, true)}</td>
  ),
  status: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)} innerHTML={MapPayoutStatusToBadge(payout.status)}></td>
  ),
  csv: (payout: Payout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <a href="#" onClick={(event) => { event.preventDefault(); downloadCSV(payout); }}>
        CSV
      </a>
    </td>
  ),
});
