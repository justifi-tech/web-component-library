export interface BusinessFormSubmitEvent {
  data: any;
  metadata?: BusinessFormEventMetaData;
}

export interface BusinessFormClickEvent {
  data?: any;
  name: BusinessFormClickActions;
}

export interface BusinessFormServerErrorEvent {
  data?: any;
  message: BusinessFormServerErrors;
}

// For right now we can use MetaData to track the step that was just completed during a submit event. 
// Eventually we can find other uses for MetaData to present to the implementer. 
interface BusinessFormEventMetaData {
  completedStep?: BusinessFormStep;
}

type BusinessFormStep = 'coreInfo' | 'legalAddress' | 'additionalQuestions' | 'representative' | 'owners';

export enum BusinessFormServerErrors {
  fetchData = 'Error retrieving business data',
  patchData = 'Error updating business data'
}

export enum BusinessFormClickActions {
  nextStep = 'nextStep',
  previousStep = 'previousStep',
  submit = 'submit'
}

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
