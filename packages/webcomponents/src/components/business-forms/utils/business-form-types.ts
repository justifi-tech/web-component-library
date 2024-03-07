export const RegExZip = /^\d{5}/;

export enum BusinessFormServerErrors {
  fetchData = 'Error retrieving business data',
  patchData = 'Error updating business data'
}

export enum BusinessFormClickEvents {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit'
}

export enum BusinessFormButton {
  submit = 'Submit',
  next = 'Next',
  previous = 'Previous'
}

export interface BusinessAddressFormFields {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

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
  