import { object, string } from 'yup';

export const RegExZip = /^\d{5}/;

type BusinessType = 'for_profit' | 'non_profit' | 'government_entity' | 'individual' | '';
type BusinessStructure = 'sole_proprietorship' |
  'single_llc' |
  'multi_llc' |
  'private_partnership' |
  'private_corporation' |
  'unincorporated_association' |
  'public_partnership' |
  'public_corporation' |
  'incorporated' |
  'unincorporated' |
  'government_unit' |
  'government_instrumentality' |
  'tax_exempt_government_instrumentality' |
  '';

export interface IBusinessInfo {
  legal_name: string,
  website_url: string,
  email: string,
  phone: string,
  doing_business_as: string,
  business_type: string,
  business_structure: string,
  industry: string,
  metadata: any,
}

export const BusinessTypeOptions: { label: string, value: BusinessType }[] = [
  {
    label: 'Choose business type',
    value: '',
  },
  {
    label: 'Individual',
    value: 'individual',
  },
];

export const BusinessStructureOptions: { label: string, value: BusinessStructure }[] = [
  {
    label: 'Choose business structure',
    value: '',
  },
  {
    label: 'sole_proprietorship',
    value: 'sole_proprietorship',
  },
  {
    label: 'single_llc',
    value: 'single_llc',
  },
  {
    label: 'multi_llc',
    value: 'multi_llc',
  },
  {
    label: 'private_partnership',
    value: 'private_partnership',
  },
  {
    label: 'private_corporation',
    value: 'private_corporation',
  },
  {
    label: 'unincorporated_association',
    value: 'unincorporated_association',
  },
  {
    label: 'public_partnership',
    value: 'public_partnership',
  },
  {
    label: 'public_corporation',
    value: 'public_corporation',
  },
  {
    label: 'incorporated',
    value: 'incorporated',
  },
  {
    label: 'unincorporated',
    value: 'unincorporated',
  },
  {
    label: 'government_unit',
    value: 'government_unit',
  },
  {
    label: 'government_instrumentality',
    value: 'government_instrumentality',
  },
  {
    label: 'tax_exempt_government_instrumentality',
    value: 'tax_exempt_government_instrumentality',
  },
];

const BusinessInfoSchema = object({
  legal_name: string().required('Enter legal name'),
  website_url: string().required('Enter website url'),
  email: string().required('Enter email'),
  phone: string().required('Enter phone number'),
  doing_business_as: string().required('Enter doing business as'),
  business_type: string().required('Select business type'),
  business_structure: string().required('Select business structure'),
  industry: string().required('Enter a business industry'),
});

export default BusinessInfoSchema;