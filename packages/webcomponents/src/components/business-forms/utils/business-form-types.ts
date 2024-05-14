import { BusinessStructure, BusinessType } from "../../../api/Business";

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

export interface OwnerFormSubmitEvent {
  data: any;
  metadata?: any;
}

export interface OwnerFormClickEvent {
  data?: any;
  name: OwnerFormClickActions;
}

export interface OwnerFormServerErrorEvent {
  data?: any;
  message: OwnerFormServerErrors;
}

export enum OwnerFormServerErrors {
  fetchData = 'Error retrieving owner data',
  patchData = 'Error updating owner data',
  postData = 'Error adding owner data'
}

export enum OwnerFormClickActions {
  removeOwner = 'removeOwner',
  addOwner = 'addOwner',
  addOwnerForm = 'addOwnerForm',
  updateOwner = 'updateOwner'
}

export const BusinessTypeOptions: { label: string; value: BusinessType | string }[] = [
  {
    label: 'Choose business type',
    value: '',
  },
  {
    label: 'Individual',
    value: BusinessType.individual,
  },
  {
    label: 'For Profit',
    value: BusinessType.for_profit,
  },
  {
    label: 'Non Profit',
    value: BusinessType.non_profit,
  },
  {
    label: 'Government Entity',
    value: BusinessType.government_entity,
  },
];

export const BusinessStructureOptions: {
  label: string;
  value: BusinessStructure | string;
}[] = [
    {
      label: 'Choose business structure',
      value: '',
    },
    {
      label: 'Sole Proprietorship',
      value: BusinessStructure.sole_proprietorship,
    },
    {
      label: 'LLC (Single)',
      value: BusinessStructure.single_llc,
    },
    {
      label: 'LLC (Multiple)',
      value: BusinessStructure.multi_llc,
    },
    {
      label: 'Private Partnership',
      value: BusinessStructure.private_partnership,
    },
    {
      label: 'Private Corporation',
      value: BusinessStructure.private_corporation,
    },
    {
      label: 'Unincorporated Association',
      value: BusinessStructure.unincorporated_association,
    },
    {
      label: 'Public Partnership',
      value: BusinessStructure.public_partnership,
    },
    {
      label: 'Public Corporation',
      value: BusinessStructure.public_corporation,
    },
    {
      label: 'Incorporated',
      value: BusinessStructure.incorporated,
    },
    {
      label: 'Unincorporated',
      value: BusinessStructure.unincorporated,
    },
    {
      label: 'Government Unit',
      value: BusinessStructure.government_unit,
    },
    {
      label: 'Government Instrumentality',
      value: BusinessStructure.government_instrumentality,
    },
    {
      label: 'Tax Exempt Government Instrumentality',
      value: BusinessStructure.tax_exempt_government_instrumentality,
    },
  ];
