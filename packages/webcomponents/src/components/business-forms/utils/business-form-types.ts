import { BusinessType } from "../../../api/Business";

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
