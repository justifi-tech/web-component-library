import { h } from '@stencil/core';
import { formatDate, formatTime } from '../../utils/utils';
import { MapCheckoutStatusToBadge } from './checkouts-status';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { Checkout } from '../../api/Checkout';

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
  created_at: (checkout: Checkout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{formatDate(checkout.created_at)}</div>
      <div class="fw-bold">{formatTime(checkout.created_at)}</div>
    </td>
  ),
  payment_amount: (checkout: Checkout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{checkout.formatPaymentAmount(checkout.payment_amount, true)}</td>
  ),
  payment_description: (checkout: Checkout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{checkout.payment_description}</td>
  ),
  sub_account_name: (checkout: Checkout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{checkout.sub_account_name}</td>
  ),
  payment_mode: (checkout: Checkout, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{checkout.payment_mode}</td>
  ),
  status: (checkout: Checkout, index: number) => (
    <td part={getAlternateTableCellPart(index)} innerHTML={MapCheckoutStatusToBadge(checkout.status)}></td>
  ),
};
