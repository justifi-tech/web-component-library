
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

export interface FileChangeEvent {
  file: File;
  document_type: string;
}

// export class DocPayload {
//   public business_id: string;
//   public file_name: string;
//   public file_type: string;
//   public document_type: string;

//   constructor(docPayload: FileChangeEvent, businessId: string) {
//     this.business_id = businessId;
//     this.file_name = docPayload.file.name;
//     this.file_type = docPayload.file.type;
//     this.document_type = docPayload.document_type;
//   }
// }

// export interface FileData {
//   payload?: DocPayload;
//   file?: File;
//   documentType?: string;
//   presigned_url?: string;
// }

export interface DocumentRecordData {
  business_id: string;
  document_type: string;
  file_name: string;
  file_type: string;
}

export class DocumentUploadData {
  public file: File;
  public document_type: string;
  public presigned_url: string | null;
  public record_data: DocumentRecordData | null;

  constructor(fileData: FileChangeEvent) {
    this.file = fileData.file;
    this.document_type = fileData.document_type;
    this.presigned_url = null;
    this.record_data = null;
  }

  public setPresignedUrl(url: string) {
    this.presigned_url = url;
  }

  public setRecordData(business_id: string) {
    this.record_data = {
      business_id: business_id,
      document_type: this.document_type,
      file_name: this.file.name,
      file_type: this.file.type,
    };
  }
}
