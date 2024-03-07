import { object, string } from 'yup';

export const coreInfoSchema = object({
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

type BusinessType =
  | 'for_profit'
  | 'non_profit'
  | 'government_entity'
  | 'individual'
  | '';
type BusinessStructure =
  | 'sole_proprietorship'
  | 'single_llc'
  | 'multi_llc'
  | 'private_partnership'
  | 'private_corporation'
  | 'unincorporated_association'
  | 'public_partnership'
  | 'public_corporation'
  | 'incorporated'
  | 'unincorporated'
  | 'government_unit'
  | 'government_instrumentality'
  | 'tax_exempt_government_instrumentality'
  | '';

export const BusinessTypeOptions: { label: string; value: BusinessType }[] = [
  {
    label: 'Choose business type',
    value: '',
  },
  {
    label: 'Individual',
    value: 'individual',
  },
  {
    label: 'For Profit',
    value: 'for_profit',
  },
  {
    label: 'Non Profit',
    value: 'non_profit',
  },
  {
    label: 'Government Entity',
    value: 'government_entity',
  },
];

export const BusinessStructureOptions: {
  label: string;
  value: BusinessStructure;
}[] = [
    {
      label: 'Choose business structure',
      value: '',
    },
    {
      label: 'Sole Proprietorship',
      value: 'sole_proprietorship',
    },
    {
      label: 'LLC (Single)',
      value: 'single_llc',
    },
    {
      label: 'LLC (Multiple)',
      value: 'multi_llc',
    },
    {
      label: 'Private Partnership',
      value: 'private_partnership',
    },
    {
      label: 'Private Corporation',
      value: 'private_corporation',
    },
    {
      label: 'Unincorporated Association',
      value: 'unincorporated_association',
    },
    {
      label: 'Public Partnership',
      value: 'public_partnership',
    },
    {
      label: 'Public Corporation',
      value: 'public_corporation',
    },
    {
      label: 'Incorporated',
      value: 'incorporated',
    },
    {
      label: 'Unincorporated',
      value: 'unincorporated',
    },
    {
      label: 'Government Unit',
      value: 'government_unit',
    },
    {
      label: 'Government Instrumentality',
      value: 'government_instrumentality',
    },
    {
      label: 'Tax Exempt Government Instrumentality',
      value: 'tax_exempt_government_instrumentality',
    },
  ];
  