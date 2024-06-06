
export interface IDocument {
  business_id: string;
  created_at: string;
  description: string | null;
  document_type: string;
  file_name: string;
  file_type: string;
  id: string;
  identity_id: string;
  metadata: any;
  platform_account_id: string;
  presigned_url: string | null;
  status: string;
  updated_at: string;
}

export class Document implements IDocument {
  public business_id: string;
  public created_at: string;
  public description: string | null;
  public document_type: string;
  public file_name: string;
  public file_type: string;
  public id: string;
  public identity_id: string;
  public metadata: any;
  public platform_account_id: string;
  public presigned_url: string | null;
  public status: string;
  public updated_at: string;

  constructor(document: IDocument) {
    this.business_id = document.business_id;
    this.created_at = document.created_at;
    this.description = document.description;
    this.document_type = document.document_type;
    this.file_name = document.file_name;
    this.file_type = document.file_type;
    this.id = document.id;
    this.identity_id = document.identity_id;
    this.metadata = document.metadata;
    this.platform_account_id = document.platform_account_id;
    this.presigned_url = document.presigned_url;
    this.status = document.status;
    this.updated_at = document.updated_at;
  }
}

export enum EntityDocumentType {
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

export interface FileSelectEvent {
  fileList: FileList;
  document_type: EntityDocumentType;
}

export interface DocumentRecordData {
  business_id: string;
  document_type: EntityDocumentType;
  file_name: string;
  file_type: string;
}

export class EntityDocumentStorage {
  public balance_sheet: EntityDocument[];
  public bank_statement: EntityDocument[];
  public government_id: EntityDocument[];
  public profit_and_loss_statement: EntityDocument[];
  public tax_return: EntityDocument[];
  public other: EntityDocument[];

  constructor() {
    this.balance_sheet = [];
    this.bank_statement = [];
    this.government_id = [];
    this.profit_and_loss_statement = [];
    this.tax_return = [];
    this.other = [];
  }
}

export interface EntityFileData {
  file: File;
  document_type: EntityDocumentType;
}

export class EntityDocument {
  public file: File;
  public fileString: string;
  public document_type: EntityDocumentType;
  public presigned_url: string | null;
  public record_data: DocumentRecordData | null;

  constructor(fileData: EntityFileData, business_id: string) {
    this.file = fileData.file;
    this.fileString = this.getFileString();
    this.document_type = fileData.document_type;
    this.presigned_url = null;
    this.record_data = {
      business_id: business_id,
      document_type: this.document_type,
      file_name: this.file.name,
      file_type: this.file.type,
    };
  }

  public getFileString() {
    let reader = new FileReader();
    reader.onload = (e) => {
     this.fileString = e.target.result as string;
    };
    reader.readAsDataURL(this.file);
    return this.fileString;
  }

  public setPresignedUrl(url: string) {
    this.presigned_url = url;
  }
}
