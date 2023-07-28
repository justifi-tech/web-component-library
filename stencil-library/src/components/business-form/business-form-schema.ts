import * as Yup from 'yup';

export const RegExZip = /^\d{5}/;

type BusinessType = 'for_profit' | 'non_profit' | 'government_entity' | 'individual' | '';
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

export const BusinessStructureOptions: { label: string; value: BusinessStructure }[] = [
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

const OwnerSchema = Yup.object({
  name: Yup.string().required('Enter owner name'),
  title: Yup.string().required('Enter owner title'),
  email: Yup.string().email('Enter valid owner email').required('Enter owner email'),
  phone: Yup.string().required('Enter owner phone number'),
  dob_day: Yup.string().required('Enter owner birth day'),
  dob_month: Yup.string().required('Enter owner birth month'),
  dob_year: Yup.string().required('Enter owner birth year'),
  identification_number: Yup.string().required('Enter owner identification number'),
  is_owner: Yup.boolean(),
  metadata: Yup.mixed(),
  address: Yup.object({
    line1: Yup.string().required('Enter owner street address'),
    city: Yup.string().required('Enter owner city'),
    state: Yup.string().required('Select owner state'),
    postal_code: Yup.string().matches(RegExZip, 'Enter valid postal code').required('Enter owner postal code'),
  }),
});

const BusinessFormSchema = Yup.object({
  legal_name: Yup.string().required('Enter legal name'),
  website_url: Yup.string().url('Enter valid website url').required('Enter website url'),
  email: Yup.string().email('Enter valid email').required('Enter email'),
  phone: Yup.string().required('Enter phone number'),
  doing_business_as: Yup.string().required('Enter doing business as'),
  business_type: Yup.string().required('Select business type'),
  business_structure: Yup.string().required('Select business structure'),
  industry: Yup.string().required('Enter a business industry'),
  representative: Yup.object({
    name: Yup.string().required('Enter representative name'),
    email: Yup.string().required('Enter representative email'),
    phone: Yup.string().required('Enter representative phone'),
    dob_day: Yup.string().required('Enter representative birth day'),
    dob_month: Yup.string().required('Enter representative birth month'),
    dob_year: Yup.string().required('Enter representative birth year'),
    identification_number: Yup.string().required('Enter representative identification number'),
    address: Yup.object({
      line1: Yup.string().required('Enter street address'),
      city: Yup.string().required('Enter city'),
      state: Yup.string().required('Select state'),
      postal_code: Yup.string().required('Enter postal code'),
    }),
  }),
  owners: Yup.array().of(OwnerSchema).min(1, 'Enter at least 1 owners'),
});

export default BusinessFormSchema;
