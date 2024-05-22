import { BusinessStructure, BusinessType } from "../../../api/Business";

interface BusinessFormOption {
  label: string;
  value: string;
}

export const businessTypeOptions: BusinessFormOption[] = [
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

export const businessStructureOptions: BusinessFormOption[] = [
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