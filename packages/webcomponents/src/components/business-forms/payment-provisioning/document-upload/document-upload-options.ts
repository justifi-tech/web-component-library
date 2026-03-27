import { Identity } from '../../../../api';

export const businessDocumentOptions = [
  { label: 'Select a document type', value: '' },
  { label: 'Articles of Incorporation', value: 'articles_of_incorporation' },
  { label: 'Business Registration', value: 'business_registration' },
];

export const financialDocumentOptions = [
  { label: 'Select a document type', value: '' },
  { label: 'Voided Check', value: 'voided_check' },
  { label: 'Bank Statement', value: 'bank_statement' },
];

export const personalDocGroup1Options = [
  { label: 'Select a document type', value: '' },
  { label: 'Canadian Passport', value: 'passport' },
  { label: 'Canadian Driver\'s License', value: 'driver_license' },
  { label: 'Canadian Government Issued ID Card', value: 'government_id' },
  { label: 'Permanent Resident Card', value: 'resident_card' },
  { label: 'Certificate of Indian Status', value: 'status_card' },
  { label: 'US State Issued Driver\'s License', value: 'driver_license' },
];

export const personalDocGroup2Options = [
  { label: 'Select a document type', value: '' },
  { label: 'Nexus Card (Photo ID)', value: 'nexus_card' },
  { label: 'Canadian Citizenship/Naturalization Card or Certificate', value: 'citizenship_card' },
  { label: 'Foreign Passport', value: 'foreign_passport' },
  { label: 'Canadian Birth Certificate', value: 'birth_certificate' },
  { label: 'Social Insurance Number (SIN) Card', value: 'sin_card' },
  { label: 'Social Security Number (SSN) Card', value: 'ssn_card' },
];

export interface DocumentCategory {
  label: string;
  value: string;
  identityId?: string;
  docTypeOptions: { label: string; value: string }[];
}

export interface UploadedDocumentEntry {
  categoryLabel: string;
  categoryValue: string;
  docTypeLabel: string;
  docTypeValue: string;
  fileName: string;
  file: File;
  identityId?: string;
}

export const staticCategories: DocumentCategory[] = [
  {
    label: 'Business Document',
    value: 'business_document',
    docTypeOptions: businessDocumentOptions,
  },
  {
    label: 'Financial Document',
    value: 'financial_document',
    docTypeOptions: financialDocumentOptions,
  },
];

export function buildOwnerCategories(owners: Identity[]): DocumentCategory[] {
  const group1Opts = personalDocGroup1Options.filter(o => o.value !== '');
  const group2Opts = personalDocGroup2Options.filter(o => o.value !== '');

  return owners.map(owner => ({
    label: `${owner.name} - Identity Document`,
    value: `personal_${owner.id}`,
    identityId: owner.id,
    docTypeOptions: [
      { label: 'Select a document type', value: '' },
      { label: '── Group 1 ──', value: '_group1_header' },
      ...group1Opts,
      { label: '── Group 2 ──', value: '_group2_header' },
      ...group2Opts,
    ],
  }));
}

export function buildAllCategories(owners: Identity[]): DocumentCategory[] {
  return [...staticCategories, ...buildOwnerCategories(owners)];
}

export const personalDocGroup1Types = new Set(
  personalDocGroup1Options.filter(o => o.value).map(o => o.value)
);

export const personalDocGroup2Types = new Set(
  personalDocGroup2Options.filter(o => o.value).map(o => o.value)
);
