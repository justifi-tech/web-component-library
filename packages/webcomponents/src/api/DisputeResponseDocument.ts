export enum DisputeResponseDocumentType {
  cancellationPolicy = 'cancellation_policy',
  customerCommunication = 'customer_communication',
  customerSignature = 'customer_signature',
  duplicateChargeDocumentation = 'duplicate_charge_documentation',
  receipt = 'receipt',
  refundPolicy = 'refund_policy',
  serviceDocumentation = 'service_documentation',
  shippingDocumentation = 'shipping_documentation',
  uncategorizedFile = 'uncategorized_file'
}

export class DisputeResponseDocumentStorage {
  public [DisputeResponseDocumentType.cancellationPolicy]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.customerCommunication]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.customerSignature]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.duplicateChargeDocumentation]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.receipt]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.refundPolicy]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.serviceDocumentation]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.shippingDocumentation]: DisputeResponseDocument[];
  public [DisputeResponseDocumentType.uncategorizedFile]: DisputeResponseDocument[];

  constructor() {
    this[DisputeResponseDocumentType.cancellationPolicy] = [];
    this[DisputeResponseDocumentType.customerCommunication] = [];
    this[DisputeResponseDocumentType.customerSignature] = [];
    this[DisputeResponseDocumentType.duplicateChargeDocumentation] = [];
    this[DisputeResponseDocumentType.receipt] = [];
    this[DisputeResponseDocumentType.refundPolicy] = [];
    this[DisputeResponseDocumentType.serviceDocumentation] = [];
    this[DisputeResponseDocumentType.shippingDocumentation] = [];
    this[DisputeResponseDocumentType.uncategorizedFile] = [];
  }
}

export interface DisputeResponseDocumentFileData {
  file: File;
  document_type: DisputeResponseDocumentType;
}

export class DisputeResponseDocument {
  public file: File;
  public fileString: string;
  public document_type: DisputeResponseDocumentType;
  public presigned_url: string | null;
  public record_data: any | null;

  constructor(fileData: DisputeResponseDocumentFileData) {
    this.file = fileData.file;
    this.fileString = this.getFileString();
    this.document_type = fileData.document_type;
    this.presigned_url = null;
    this.record_data = {
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
