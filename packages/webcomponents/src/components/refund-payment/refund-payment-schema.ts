import { object, string } from 'yup';
import { formatCurrency } from '../../utils/utils';
import { RefundReasons } from '../../api';

const amountValidation = (maxAmount: string) => {
  const max = +maxAmount;
  return (
    string()
    .required('Amount is required')
    .test('max-amount', `Refund amount cannot be more than payment amount: ${formatCurrency(max)}`, function (value) {
      return +value <= +max;
    })
  )
}

const RefundPaymentSchema = (maxRefundAmount: string) => {
  const schema = object({
    amount: amountValidation(maxRefundAmount),
    description: string().optional(),
    reason: string().optional()
      .oneOf([
        RefundReasons.customerRequest,
        RefundReasons.duplicate,
        RefundReasons.fraudulent,
      ], 'Select a reason')
  })
  return schema;
}

export default RefundPaymentSchema;
