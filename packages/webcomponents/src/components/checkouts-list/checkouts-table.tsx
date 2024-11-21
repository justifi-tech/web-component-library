import { h } from '@stencil/core';
import { formatCurrency, formatDate, formatTime, MapCheckoutStatusToBadge } from '../../utils/utils';
import { ICheckout } from '../../api/Checkout';


export const defaultColumnsKeys = 'created_at,payment_amount,payment_description,paymentMode,status';

const tableColumns = {
  created_at: {
    label: 'Processed On',
    title: 'The date each checkout occurred',
  },
  payment_amount: {
    label: 'Payment Amount',
    title: 'The dollar amount of each checkout',
  },
  payment_description: {
    label: 'Payment Description',
    title: 'The description of each checkout',
  },
  sub_account_name: {
    label: 'Sub Account',
    title: 'The sub account associated with the checkout',
  },
  paymentMode: {
    label: 'Payment Mode',
    title: 'The payment mode of each checkout',
  },
  status: {
    label: 'Status',
    title: 'The current status of each checkout',
  },
}

const tableCells = {
  created_at: (value) => (
    <th>
      <div class="fw-bold">{formatDate(value)} </div>
      < div class="fw-bold">{formatTime(value)} </div>
    </th>
  ),
  payment_amount: (value) => (<td>{formatCurrency(value, true, true)} </td>),
  payment_description: (value) => (<td>{value}</td>),
  sub_account_name: (value) => (<td>{value}</td>),
  paymentMode: (value) => (<td>{value}</td>),
  status: (value) => (<td innerHTML={MapCheckoutStatusToBadge(value)}></td>),
}

class CheckoutsTable {
  columnKeys: string[];
  checkouts: ICheckout[];

  get columnData() {
    return this.columnKeys.map((key) => tableColumns[key]);
  }

  get rowData() {
    return this.checkouts.map((checkout) => {
      return this.columnKeys.map((key) => {
        return tableCells[key](checkout[key]);
      });
    });
  }

  constructor(checkouts: ICheckout[], columns: string) {
    this.columnKeys = columns.split(',');
    this.checkouts = checkouts;
  }
}

export default CheckoutsTable;