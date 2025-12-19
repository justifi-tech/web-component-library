// Re-export types from @justifi/types for backward compatibility
export type { IDocument, DocumentRecordData } from '@justifi/types';
export { EntityDocumentType, EntityDocumentStatus } from '@justifi/types';

// Import types for use in this file
import { EntityDocumentType, type DocumentRecordData } from '@justifi/types';

// Component-specific types (use browser APIs like FileList and File)
export interface FileSelectEvent {
  fileList: FileList;
  document_type: EntityDocumentType;
}

export interface EntityFileData {
  file: File;
  document_type: EntityDocumentType;
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
        this.fileData = e.target?.result as ArrayBuffer;
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
