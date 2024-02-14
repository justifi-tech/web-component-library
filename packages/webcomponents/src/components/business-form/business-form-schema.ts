import { object, string } from 'yup';
import legalAddressSchema from './legal-address-form/legal-address-form-schema';

export const RegExZip = /^\d{5}/;

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

export class Business {
  public legal_name = '';
  public website_url = '';
  public email: string = '';
  public phone: string = '';
  public doing_business_as: string = '';
  public business_type: string = '';
  public business_structure: string = '';
  public industry: string = '';
  public metadata: any = {};

  constructor(data?: any) {
    if (data) {
      this.legal_name = data.legal_name;
      this.website_url = data.website_url;
      this.email = data.email;
      this.phone = data.phone;
      this.doing_business_as = data.doing_business_as;
      this.business_type = data.business_type;
      this.business_structure = data.business_structure;
      this.industry = data.industry;
      this.metadata = data.metadata;
    }
  }
}

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

const businessGenericInfoSchema = object({
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

const addressSchema = object({
  line1: string().required('Enter street address'),
  city: string().required('Enter city'),
  state: string().required('Select state'),
  postal_code: string().required('Enter postal code'),
});

const representativeSchema = object({
  name: string().required('Enter representative name'),
  email: string()
    .email('Enter valid representative email')
    .required('Enter representative email'),
  phone: string().required('Enter representative phone number'),
  dob_day: string().required('Enter representative birth day'),
  dob_month: string().required('Enter representative birth month'),
  dob_year: string().required('Enter representative birth year'),
  identification_number: string(),
  address: addressSchema,
});

// const ownerSchema = object({
//   name: string().required('Enter owner name'),
//   title: string().required('Enter owner title'),
//   email: string()
//     .email('Enter valid owner email')
//     .required('Enter owner email'),
//   phone: string().required('Enter owner phone number'),
//   dob_day: string().required('Enter owner birth day'),
//   dob_month: string().required('Enter owner birth month'),
//   dob_year: string().required('Enter owner birth year'),
//   identification_number: string(),
//   is_owner: boolean(),
//   address: addressSchema,
// });

const additionQuestionsSchema = object({
  business_revenue: string().required('Enter business revenue'),
  business_payment_volume: string().required('Enter business payment volume'),
  business_dispute_volume: string().required('Enter business dispute volume'),
  business_receivable_volume: string().required('Enter business receivable volume'),
});

const businessFormSchema = object({
  ...businessGenericInfoSchema.fields,
  legal_address: legalAddressSchema.required('Enter legal address'),
  additional_questions: additionQuestionsSchema.nullable(),
  representative: representativeSchema.nullable()
});

export default businessFormSchema;
