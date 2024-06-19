import { BusinessClassification } from "../../../api/Business";

interface BusinessFormOption {
  label: string;
  value: string;
}

export const businessClassificationOptions: BusinessFormOption[] = [
  {
    label: 'Choose business classification',
    value: '',
  },
  {
    label: 'Sole Proprietor',
    value: BusinessClassification.sole_proprietor,
  },
  {
    label: 'Partnership',
    value: BusinessClassification.partnership,
  },
  {
    label: 'Corporation',
    value: BusinessClassification.corporation,
  },
  {
    label: 'Public Company',
    value: BusinessClassification.public_company,
  },
  {
    label: 'Limited',
    value: BusinessClassification.limited,
  },
  {
    label: 'Non Profit',
    value: BusinessClassification.non_profit,
  },
  {
    label: 'Government',
    value: BusinessClassification.government,
  },
];

export const businessServiceReceivedOptions: BusinessFormOption[] = [
  {
    label: 'Within 7 days',
    value: 'Within 7 days',
  },
  {
    label: 'Within 30 days',
    value: 'Within 30 days',
  },
  {
    label: 'Within 90 days',
    value: 'Within 90 days',
  },
  {
    label: 'Within 120 days',
    value: 'Within 120 days',
  },
  {
    label: 'More than 120 days',
    value: 'More than 120 days',
  }
];

export const recurringPaymentsOptions: BusinessFormOption[] = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  }
];

export const seasonalBusinessOptions: BusinessFormOption[] = [
  {
    label: 'Yes. The majority of the business revenue is generated in 3-6 months.',
    value: 'Yes',
  },
  {
    label: 'No. The business revenue is generated evenly throughout the year.',
    value: 'No',
  }
];

export const bankAccountTypeOptions: BusinessFormOption[] = [
  {
    label: 'Checking',
    value: 'checking',
  },
  {
    label: 'Savings',
    value: 'savings',
  }
];