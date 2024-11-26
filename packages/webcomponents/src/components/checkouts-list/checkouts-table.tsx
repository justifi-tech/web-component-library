import { h } from '@stencil/core';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { MapCheckoutStatusToBadge } from './checkouts-status';

export const defaultColumnsKeys = 'created_at,payment_amount,payment_description,payment_mode,status';

export const checkoutTableColumns = {
  created_at: () => (
    <th part="table-head-cell" scope="col" title="The date each checkout occurred">
      Processed On
    </th>
  ),
  payment_amount: () => (
    <th part="table-head-cell" scope="col" title="The dollar amount of each checkout">
      Payment Amount
    </th>
  ),
  payment_description: () => (
    <th part="table-head-cell" scope="col" title="The description of each checkout">
      Payment Description
    </th>
  ),
  sub_account_name: () => (
    <th part="table-head-cell" scope="col" title="The sub account associated with the checkout">
      Sub Account
    </th>
  ),
  payment_mode: () => (
    <th part="table-head-cell" scope="col" title="The payment mode of each checkout">
      Payment Mode
    </th>
  ),
  status: () => (
    <th part="table-head-cell" scope="col" title="The current status of each checkout">
      Status
    </th>
  ),
}

export const checkoutTableCells = {
  created_at: (value) => (
    <th>
      <div class="fw-bold">{formatDate(value)} </div>
      < div class="fw-bold">{formatTime(value)} </div>
    </th>
  ),
  payment_amount: (value) => (<td>{formatCurrency(value, true, true)} </td>),
  payment_description: (value) => (<td>{value}</td>),
  sub_account_name: (value) => (<td>{value}</td>),
  payment_mode: (value) => (<td>{value}</td>),
  status: (value) => (<td innerHTML={MapCheckoutStatusToBadge(value)}></td>),
}
