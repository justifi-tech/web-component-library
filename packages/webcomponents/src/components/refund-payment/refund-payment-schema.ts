import * as yup from 'yup';
import { formatCurrency } from '../../utils/utils';

export interface RefundPaymentFields {
  amount: string;
  description: string;
}

const RefundPaymentSchema = (maxRefundAmount: string) => {
  const maxAmount = +maxRefundAmount;
  return yup.object().shape({
    amount: yup
      .string()
      .required('Amount is required')
      .typeError('Amount must be a number')
      .test(
        'amount',
        `Refund amount cannot be more than ${formatCurrency(maxAmount)}`,
        function (value) {
          return +value <= maxAmount;
        },
      )
      .nullable(),
  })
};

export default RefundPaymentSchema;
