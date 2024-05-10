import { BusinessType } from "../../../api/Business";

export const businessTypeOptions: { label: string; value: BusinessType | string }[] = [
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

export const businessServiceReceivedOptions: { label: string; value: string }[] = [
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

export const recurringPaymentsOptions: { label: string; value: string }[] = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  }
];

export const seasonalBusinessOptions: { label: string; value: string }[] = [
  {
    label: 'Yes. The majority of the business revenue is generated in 3-6 months.',
    value: 'Yes',
  },
  {
    label: 'No. The business revenue is generated evenly throughout the year.',
    value: 'No',
  }
];