export interface IDocument {
  business_id: string;
  created_at: string;
  description: string | null;
  document_type: string;
  file_name: string;
  file_type: string;
  id: string;
  identity_id: string;
  metadata: unknown;
  platform_account_id: string;
  presigned_url: string | null;
  status: EntityDocumentStatus;
  updated_at: string;
}

export enum EntityDocumentType {
  voidedCheck = 'voided_check',
  balanceSheet = 'balance_sheet',
  bankStatement = 'bank_statement',
  governmentId = 'government_id',
  profitAndLossStatement = 'profit_and_loss_statement',
  taxReturn = 'tax_return',
  other = 'other',
}

export enum EntityDocumentStatus {
  pending = 'pending',
  uploaded = 'uploaded',
  canceled = 'canceled',
  needed = 'needed',
}

export interface DocumentRecordData {
  business_id: string;
  document_type: EntityDocumentType;
  file_name: string;
  file_type: string;
}
