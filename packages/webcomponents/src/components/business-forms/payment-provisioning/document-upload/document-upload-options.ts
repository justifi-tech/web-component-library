import { CountryCode } from '../../../../utils/country-codes';

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
  docTypeOptions: { label: string; value: string }[];
}

export type DocumentUploadStatus = 'uploading' | 'uploaded' | 'error';

export interface UploadedDocumentEntry {
  categoryLabel: string;
  categoryValue: string;
  docTypeLabel: string;
  docTypeValue: string;
  fileName: string;
  file: File;
  status: DocumentUploadStatus;
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

export function buildPersonalDocumentCategories(): DocumentCategory[] {
  return [
    {
      label: 'Identity Document - Group 1',
      value: 'personal_group1',
      docTypeOptions: personalDocGroup1Options,
    },
    {
      label: 'Identity Document - Group 2',
      value: 'personal_group2',
      docTypeOptions: personalDocGroup2Options,
    },
  ];
}

export const financialOnlyCategories: DocumentCategory[] = [
  {
    label: 'Financial Document',
    value: 'financial_document',
    docTypeOptions: financialDocumentOptions,
  },
];

export function buildAllCategories(country?: CountryCode): DocumentCategory[] {
  if (country === CountryCode.USA) {
    return financialOnlyCategories;
  }
  return [...staticCategories, ...buildPersonalDocumentCategories()];
}

export const personalDocGroup1Types = new Set(
  personalDocGroup1Options.filter(o => o.value).map(o => o.value)
);

export const personalDocGroup2Types = new Set(
  personalDocGroup2Options.filter(o => o.value).map(o => o.value)
);
