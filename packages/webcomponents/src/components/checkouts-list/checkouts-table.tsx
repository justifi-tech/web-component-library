import { h } from '@stencil/core';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { MapCheckoutStatusToBadge } from './checkouts-status';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';

export const defaultColumnsKeys = 'created_at,payment_amount,payment_description,payment_mode,status';

export const checkoutTableColumns = {
  created_at: () => (
    <th part={tableHeadCell} scope="col" title="The date each checkout occurred">
      Processed On
    </th>
  ),
  payment_amount: () => (
    <th part={tableHeadCell} scope="col" title="The dollar amount of each checkout">
      Payment Amount
    </th>
  ),
  payment_description: () => (
    <th part={tableHeadCell} scope="col" title="The description of each checkout">
      Payment Description
    </th>
  ),
  sub_account_name: () => (
    <th part={tableHeadCell} scope="col" title="The sub account associated with the checkout">
      Sub Account
    </th>
  ),
  payment_mode: () => (
    <th part={tableHeadCell} scope="col" title="The payment mode of each checkout">
      Payment Mode
    </th>
  ),
  status: () => (
    <th part={tableHeadCell} scope="col" title="The current status of each checkout">
      Status
    </th>
  ),
}

export const checkoutTableCells = {
  created_at: (value, index) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{formatDate(value)} </div>
      < div class="fw-bold">{formatTime(value)} </div>
    </td>
  ),
  payment_amount: (value, index) => (<td part={getAlternateTableCellPart(index)}>{formatCurrency(value, true, true)} </td>),
  payment_description: (value, index) => (<td part={getAlternateTableCellPart(index)}>{value}</td>),
  sub_account_name: (value, index) => (<td part={getAlternateTableCellPart(index)}>{value}</td>),
  payment_mode: (value, index) => (<td part={getAlternateTableCellPart(index)}>{value}</td>),
  status: (value, index) => (<td part={getAlternateTableCellPart(index)}>{MapCheckoutStatusToBadge(value)}</td>),
}
