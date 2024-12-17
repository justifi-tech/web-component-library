import { h } from '@stencil/core';
import { MapPaymentStatusToBadge } from './payments-status';
import { formatCurrency, convertToLocal } from '../../utils/utils';

export const defaultColumnsKeys = 'created_at,amount,status,payment_type,description,payers_name,last_four_digits';

export const paymentTableColumns = {
  created_at: () => (
    <th part="table-head-cell" scope="col" title="The date and time each payment was made">
      Date
    </th>
  ),
  amount: () => (
    <th part="table-head-cell" scope="col" title="The dollar amount of each payment">
      Amount
    </th>
  ),
  status: () => (
    <th part="table-head-cell" scope="col" title="The current status of each payment">
      Status
    </th>
  ),
  payment_type: () => (
    <th part="table-head-cell" scope="col" title="The type of each payment">
      Type
    </th>
  ),
  description: () => (
    <th part="table-head-cell" scope="col" title="The payment description, if you provided one">
      Description
    </th>
  ),
  payers_name: () => (
    <th part="table-head-cell" scope="col" title="The name associated with the payment method">
      Account Holder
    </th>
  ),
  last_four_digits: () => (
    <th part="table-head-cell" scope="col" title="The brand and last 4 digits of the payment method">
      Payment Method
    </th>
  ),
};

export const paymentTableCells = {
  created_at: (value) => (
    <td part="table-cell">
      <div class="fw-bold">{convertToLocal(value, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(value, { showTime: true})}</div>
    </td>
  ),
  amount: (value) => (<td part="table-cell">{formatCurrency(value, true, true)}</td>),
  status: (value) => (<td part="table-cell" innerHTML={MapPaymentStatusToBadge(value)}></td>),
  payment_type: (value) => (<td part="table-cell">{value}</td>),
  description: (value) => (<td part="table-cell">{value}</td>),
  payers_name: (value) => (<td part="table-cell">{value}</td>),
  last_four_digits: (value) => (<td part="table-cell">{value}</td>)
};
