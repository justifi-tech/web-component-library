import { object, string } from 'yup';

const ShippingDetailsSchema = object({
  shipping_carrier: string().nullable(),
  shipping_tracking_number: string().nullable(),
  shipping_date: string().nullable(),
  shipping_address: string().nullable(),
});

export default ShippingDetailsSchema;