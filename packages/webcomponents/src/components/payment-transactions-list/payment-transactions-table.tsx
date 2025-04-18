import { h } from '@stencil/core';
import { convertToLocal } from '../../utils/utils';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { PaymentBalanceTransaction } from '../../api';

export const defaultColumnsKeys = 'created_at,type,id,amount,balance';

export const paymentTransactionTableColumns = {
  created_at: () => (
    <th part={tableHeadCell} scope="col" title="The date and time each transaction was made">
      Processed On
    </th>
  ),
  type: () => (
    <th part={tableHeadCell} scope="col" title="The type of each transaction">
      Type
    </th>
  ),
  id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of each transaction">
      ID
    </th>
  ),
  amount: () => (
    <th part={tableHeadCell} scope="col" title="The dollar amount of each transaction">
      Amount
    </th>
  ),
  balance: () => (
    <th part={tableHeadCell} scope="col" title="The running total amount of this payment that belongs to you">
      Balance
    </th>
  ),
  currency: () => (
    <th part={tableHeadCell} scope="col" title="The currency of each transaction">
      Currency
    </th>
  ),
  financial_transaction_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the financial transaction associated with the payment balance transaction">
      Financial Transaction ID
    </th>
  ),
  payment_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the payment associated with the payment balance transaction">
      Payment ID
    </th>
  ),
  payment_balance_txn_type: () => (
    <th part={tableHeadCell} scope="col" title="The type of the payment balance transaction">
      Transaction Type
    </th>
  ),
  source_id: () => (
    <th part={tableHeadCell} scope="col" title="The unique identifier of the source object associated with the payment balance transaction">
      Source ID
    </th>
  ),
  source_type: () => (
    <th part={tableHeadCell} scope="col" title="The type of the source object associated with the payment balance transaction">
      Source Type
    </th>
  ),
};

export const paymentTransactionTableCells = {
  created_at: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{convertToLocal(balanceTransaction.created_at, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(balanceTransaction.created_at, { showTime: true })}</div>
    </td>
  ),
  type: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.payment_balance_txn_type}</td>
  ),
  id: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.id}</td>
  ),
  amount: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.formattedPaymentAmount(balanceTransaction.amount)}</td>
  ),
  balance: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.formattedPaymentAmount(balanceTransaction.balance)}</td>
  ),
  currency: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.currency}</td>
  ),
  financial_transaction_id: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.financial_transaction_id}</td>
  ),
  payment_id: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.payment_id}</td>
  ),
  payment_balance_txn_type: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.payment_balance_txn_type}</td>
  ),
  source_id: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.source_id}</td>
  ),
  source_type: (balanceTransaction: PaymentBalanceTransaction, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{balanceTransaction.source_type}</td>
  ),
};
