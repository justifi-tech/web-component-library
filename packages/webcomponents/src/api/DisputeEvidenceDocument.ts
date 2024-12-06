export enum DisputeEvidenceDocumentType {
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

export class DisputeEvidenceDocumentStorage {
  public [DisputeEvidenceDocumentType.cancellationPolicy]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.customerCommunication]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.customerSignature]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.duplicateChargeDocumentation]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.receipt]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.refundPolicy]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.serviceDocumentation]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.shippingDocumentation]: DisputeEvidenceDocument[];
  public [DisputeEvidenceDocumentType.uncategorizedFile]: DisputeEvidenceDocument[];

  constructor() {
    this[DisputeEvidenceDocumentType.cancellationPolicy] = [];
    this[DisputeEvidenceDocumentType.customerCommunication] = [];
    this[DisputeEvidenceDocumentType.customerSignature] = [];
    this[DisputeEvidenceDocumentType.duplicateChargeDocumentation] = [];
    this[DisputeEvidenceDocumentType.receipt] = [];
    this[DisputeEvidenceDocumentType.refundPolicy] = [];
    this[DisputeEvidenceDocumentType.serviceDocumentation] = [];
    this[DisputeEvidenceDocumentType.shippingDocumentation] = [];
    this[DisputeEvidenceDocumentType.uncategorizedFile] = [];
  }
}

export class DisputeEvidenceDocument {
  public file_name: string;
  public file_type: string;
  public dispute_evidence_type: DisputeEvidenceDocumentType;

  private _file: File;
  private _presignedUrl: string;

  set presignedUrl(url: string) {
    this._presignedUrl = url;
  }

  get presignedUrl() {
    return this._presignedUrl;
  }

  async getFileString() {
    let fileString = '';
    const fileStringPromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileString = e.target.result as string
        resolve(fileString);
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      reader.readAsDataURL(this._file);
    });
    await fileStringPromise;
    return fileString;
  };

  constructor(file: File, dispute_evidence_type: DisputeEvidenceDocumentType) {
    this._file = file;
    this.file_name = file.name;
    this.file_type = file.type;
    this.dispute_evidence_type = dispute_evidence_type;
  }
}
