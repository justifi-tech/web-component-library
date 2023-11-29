import * as yup from 'yup';

export interface RefundFormFields {
  amount: number | null; // Allowing null for initial state or cleared inputs
  message: string;
}

const RefundFormSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Amount is required')
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .test(
      'maxAmount',
      'Refund amount cannot be more than the original payment amount',
      function (value) {
        return value <= this.options.context.originalPaymentAmount;
      },
    )
    .nullable(),
});

export default RefundFormSchema;
