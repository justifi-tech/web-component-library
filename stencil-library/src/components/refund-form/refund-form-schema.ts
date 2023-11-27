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
    .nullable(), // To allow null values, useful if you clear the input
  message: yup.string().trim().max(500, 'Notes must be 500 characters or less'), // Assuming a max length for notes
});

export default RefundFormSchema;
