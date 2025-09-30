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
  public voided_check: EntityDocument[];
  public balance_sheet: EntityDocument[];
  public bank_statement: EntityDocument[];
  public government_id: EntityDocument[];
  public profit_and_loss_statement: EntityDocument[];
  public tax_return: EntityDocument[];
  public other: EntityDocument[];

  constructor() {
    this.voided_check = [];
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
  public fileData: ArrayBuffer | null = null;
  public document_type: EntityDocumentType;
  public presigned_url: string | null;
  public record_data: DocumentRecordData | null;

  constructor(fileData: EntityFileData, business_id: string) {
    this.file = fileData.file;
    this.document_type = fileData.document_type;
    this.presigned_url = null;
    this.record_data = {
      business_id: business_id,
      document_type: this.document_type,
      file_name: this.file.name,
      file_type: this.file.type,
    };
  }

  public async getFileData(): Promise<ArrayBuffer> {
    if (this.fileData) {
      return this.fileData;
    }

    const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileData = e.target.result as ArrayBuffer;
        resolve(this.fileData);
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      reader.readAsArrayBuffer(this.file);
    });
    
    return await fileDataPromise;
  }

  public setPresignedUrl(url: string) {
    this.presigned_url = url;
  }
}
