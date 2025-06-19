export enum DisputeEvidenceDocumentType {
  activity_log = 'activity_log',
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
    const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result as ArrayBuffer);
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      reader.readAsArrayBuffer(this._file);
    });
    return await fileDataPromise;
  };

  constructor(file: File, dispute_evidence_type: DisputeEvidenceDocumentType) {
    this._file = file;
    this.file_name = file.name;
    this.file_type = file.type;
    this.dispute_evidence_type = dispute_evidence_type;
  }
}
