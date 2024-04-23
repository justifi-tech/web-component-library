import { object, string } from 'yup';

export const businessCoreInfoSchema = (easyValidate?: boolean) => {
  const schema = object({
    legal_name: string().required('Enter legal name'),
    website_url: string()
      .url('Enter valid website url')
      .required('Enter website url'),
    email: string().email('Enter valid email').required('Enter email'),
    phone: string().required('Enter phone number'),
    doing_business_as: string().required('Enter doing business as'),
    business_type: string().required('Select business type'),
    business_structure: string().required('Select business structure'),
    industry: string().required('Enter a business industry'),
  });

  const easySchema = object({
    legal_name: string().required('Enter legal name').nullable(),
    website_url: string()
      .url('Enter valid website url')
      .required('Enter website url')
      .nullable(),
    email: string().email('Enter valid email').required('Enter email').nullable(),
    phone: string().required('Enter phone number').nullable(),
    doing_business_as: string().required('Enter doing business as').nullable(),
    business_type: string().required('Select business type').nullable(),
    business_structure: string().required('Select business structure').nullable(),
    industry: string().required('Enter a business industry').nullable(),
  });

  return easyValidate ? easySchema : schema;
};
