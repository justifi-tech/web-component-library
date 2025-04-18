import { h } from '@stencil/core';
import { convertToLocal } from '../../utils/utils';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { PayoutBalanceTransaction } from '../../api';

export const defaultColumnsKeys = 'created_at,txn_type,description,amount,fee,net';

export const payoutTransactionTableColumns = {
  id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of each transaction">
      ID
    </th>
  ),
  account_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the account associated with each transaction">
      Account ID
    </th>
  ),
  payout_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the payout associated with each transaction">
      Payout ID
    </th>
  ),
  financial_transaction_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the financial transaction associated with the payment balance transaction">
      Financial Transaction ID
    </th>
  ),
  amount: () => (
    <th part={tableHeadCell} scope="col" title="The dollar amount of each transaction">
      Amount
    </th>
  ),
  fee: () => (
    <th part={tableHeadCell} scope="col" title="The fee associated with each transaction">
      Fee
    </th>
  ),
  net: () => (
    <th part={tableHeadCell} scope="col" title="The net amount of each transaction">
      Net
    </th>
  ),
  currency: () => (
    <th part={tableHeadCell} scope="col" title="The currency of each transaction">
      Currency
    </th>
  ),
  description: () => (
    <th part={tableHeadCell} scope="col" title="The description of each transaction">
      Description
    </th>
  ),
  source_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the source object associated with the payment balance transaction">
      Source ID
    </th>
  ),
  txn_type: () => (
    <th part={tableHeadCell} scope="col" title="The type of each transaction">
      Type
    </th>
  ),
  created_at: () => (
    <th part={tableHeadCell} scope="col" title="The date and time each transaction was made">
      Processed On
    </th>
  ),
  available_on: () => (
    <th part={tableHeadCell} scope="col" title="The date and time each transaction will be available">
      Available On
    </th>
  ),
  updated_at: () => (
    <th part={tableHeadCell} scope="col" title="The date and time each transaction was last updated">
      Updated On
    </th>
  ),
};

export const payoutTransactionTableCells = {
  id: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.id)}>
      {transaction.id}
    </td>
  ),
  account_id: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.account_id)}>
      {transaction.account_id}
    </td>
  ),
  payout_id: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.payout_id)}>
      {transaction.payout_id}
    </td>
  ),
  financial_transaction_id: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.financial_transaction_id)}>
      {transaction.financial_transaction_id}
    </td>
  ),
  amount: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.amount)}>
      {transaction.formattedPaymentAmount(transaction.amount)}
    </td>
  ),
  fee: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.fee)}>
      {transaction.formattedPaymentAmount(transaction.fee)}
    </td>
  ),
  net: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.net)}>
      {transaction.formattedPaymentAmount(transaction.net)}
    </td>
  ),
  currency: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.currency)}>
      {transaction.currency}
    </td>
  ),
  description: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.description)}>
      {transaction.description}
    </td>
  ),
  source_id: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.source_id)}>
      {transaction.source_id}
    </td>
  ),
  txn_type: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.txn_type)}>
      {transaction.txn_type}
    </td>
  ),
  created_at: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.created_at)}>
      <div class="fw-bold">{convertToLocal(transaction.created_at, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(transaction.created_at, { showTime: true })}</div>
    </td>
  ),
  available_on: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.available_on)}>
      <div class="fw-bold">{convertToLocal(transaction.available_on, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(transaction.available_on, { showTime: true })}</div>
    </td>
  ),
  updated_at: (transaction: PayoutBalanceTransaction) => (
    <td part={getAlternateTableCellPart(transaction.updated_at)}>
      <div class="fw-bold">{convertToLocal(transaction.updated_at, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(transaction.updated_at, { showTime: true })}</div>
    </td>
  ),
};
