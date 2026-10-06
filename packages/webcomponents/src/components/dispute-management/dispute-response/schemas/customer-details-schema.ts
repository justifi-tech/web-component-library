import { object, string } from 'yup';

const CustomerDetailsSchema = object({
  customer_name: string().nullable(),
  customer_email_address: string().nullable(),
  customer_billing_address: string().nullable(),
});

export default CustomerDetailsSchema;