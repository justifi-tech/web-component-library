import { object, string } from 'yup';

const ProductOrServiceSchema = object({
  product_description: string().nullable(),
  service_date: string().nullable(),
});

export default ProductOrServiceSchema;