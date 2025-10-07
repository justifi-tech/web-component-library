import { h } from '@stencil/core';
import { MapPaymentStatusToBadge } from './payments-status';
import { convertToLocal } from '../../utils/utils';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { Payment, CardBrand } from '../../api/Payment';

export const mapCardBrandToDisplayName = (brand: CardBrand | string | undefined): string => {
  if (!brand) return 'N/A';

  const brandMap: Record<string, string> = {
    'visa': 'VISA',
    'mastercard': 'Mastercard',
    'american_express': 'American Express',
    'discover': 'Discover',
    'diners_club': 'Diners Club',
    'jcb': 'JCB',
    'china_unionpay': 'China UnionPay',
    'unknown': 'Unknown'
  };

  return brandMap[brand.toLowerCase()] || brand;
};

export const defaultColumnsKeys = 'created_at,amount,status,payment_type,description,payers_name,last_four_digits,card_brand';

export const paymentTableColumns = {
  created_at: () => (
    <th part={tableHeadCell} scope="col" title="The date and time each payment was made">
      Date
    </th>
  ),
  amount: () => (
    <th part={tableHeadCell} scope="col" title="The dollar amount of each payment">
      Amount
    </th>
  ),
  status: () => (
    <th part={tableHeadCell} scope="col" title="The current status of each payment">
      Status
    </th>
  ),
  payment_type: () => (
    <th part={tableHeadCell} scope="col" title="The type of each payment">
      Type
    </th>
  ),
  description: () => (
    <th part={tableHeadCell} scope="col" title="The payment description, if you provided one">
      Description
    </th>
  ),
  payers_name: () => (
    <th part={tableHeadCell} scope="col" title="The name associated with the payment method">
      Account Holder
    </th>
  ),
  last_four_digits: () => (
    <th part={tableHeadCell} scope="col" title="The brand and last 4 digits of the payment method">
      Payment Method
    </th>
  ),
  card_brand: () => (
    <th part={tableHeadCell} scope="col" title="The brand of the payment method">
      Card Brand
    </th>
  ),
};

export const paymentTableCells = {
  created_at: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{convertToLocal(payment.created_at, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(payment.created_at, { showTime: true })}</div>
    </td>
  ),
  amount: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payment.formattedPaymentAmount(payment.amount)}</td>
  ),
  status: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{MapPaymentStatusToBadge(payment.status)}</td>
  ),
  payment_type: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payment.payment_type}</td>
  ),
  description: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payment.description}</td>
  ),
  payers_name: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payment.payers_name}</td>
  ),
  last_four_digits: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{payment.last_four_digits}</td>
  ),
  card_brand: (payment: Payment, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{mapCardBrandToDisplayName(payment.payment_method.card?.brand || payment.payment_method.bank_account?.brand)}</td>
  ),
};
