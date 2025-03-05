import * as yup from 'yup';

export interface RefundPaymentFields {
  amount: number | null; // Allowing null for initial state or cleared inputs
  description: string;
}

const RefundPaymentSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Amount is required')
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .test(
      'amount',
      'Refund amount cannot be more than the original payment amount',
      function (value) {
        return value <= this.options.context.amount;
      },
    )
    .nullable(),
});

export default RefundPaymentSchema;
