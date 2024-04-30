import { object, string } from 'yup';
import { phoneRegex, urlRegex } from '../utils/helpers';

export const businessCoreInfoSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    legal_name: string().required('Enter legal name'),
    website_url: string().matches(urlRegex, 'Enter valid website url').required('Enter website url'),
    email: string().email('Enter valid email').required('Enter email'),
    phone: string().matches(phoneRegex, 'Enter valid phone number').required('Enter phone number'),
    doing_business_as: string().required('Enter doing business as'),
    business_type: string().required('Select business type'),
    business_structure: string().required('Select business structure'),
    industry: string().required('Enter a business industry'),
  });

  const easySchema = object({
    legal_name: string().required('Enter legal name'),
    website_url: string().matches(urlRegex, 'Enter valid website url').nullable(),
    email: string().email('Enter valid email').nullable(),
    phone: string().matches(phoneRegex, 'Enter valid phone number').nullable(),
    doing_business_as: string().nullable(),
    business_type: string().nullable(),
    business_structure: string().nullable(),
    industry: string().nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
