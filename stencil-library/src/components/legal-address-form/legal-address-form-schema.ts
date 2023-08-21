import * as Yup from 'yup';

const legalAddressSchema = Yup.object({
  line1: Yup.string().required('Enter street address'),
  line2: Yup.string(),
  city: Yup.string().required('Enter city'),
  state: Yup.string().required('Select state'),
  postal_code: Yup.string().required('Enter postal code'),
  country: Yup.string().required('Select country'),
});

export default legalAddressSchema;
