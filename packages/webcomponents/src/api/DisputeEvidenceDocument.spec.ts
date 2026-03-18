import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from './DisputeEvidenceDocument';

// Minimal File mock for node environment
class MockFile {
  name: string;
  type: string;
  private _content: ArrayBuffer;

  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    this.name = name;
    this.type = options?.type || '';
    this._content = new ArrayBuffer(8);
  }

  getContent(): ArrayBuffer {
    return this._content;
  }
}

// FileReader mock that synchronously resolves
class MockFileReader {
  onload: ((e: { target: { result: ArrayBuffer } }) => void) | null = null;
  onerror: (() => void) | null = null;
  private _result: ArrayBuffer | null = null;

  readAsArrayBuffer(file: MockFile) {
    this._result = file.getContent();
    Promise.resolve().then(() => {
      if (this.onload) {
        this.onload({ target: { result: this._result } });
      }
    });
  }
}

beforeAll(() => {
  (global as any).File = MockFile;
  (global as any).FileReader = MockFileReader;
});

describe('DisputeEvidenceDocument', () => {
  describe('constructor', () => {
    it('sets file_name from the File', () => {
      const file = new (global as any).File([], 'receipt.pdf', { type: 'application/pdf' });
      const doc = new DisputeEvidenceDocument(file, DisputeEvidenceDocumentType.receipt);
      expect(doc.file_name).toBe('receipt.pdf');
    });

    it('sets file_type from the File', () => {
      const file = new (global as any).File([], 'receipt.pdf', { type: 'application/pdf' });
      const doc = new DisputeEvidenceDocument(file, DisputeEvidenceDocumentType.receipt);
      expect(doc.file_type).toBe('application/pdf');
    });

    it('sets dispute_evidence_type', () => {
      const file = new (global as any).File([], 'policy.pdf', { type: 'application/pdf' });
      const doc = new DisputeEvidenceDocument(file, DisputeEvidenceDocumentType.cancellationPolicy);
      expect(doc.dispute_evidence_type).toBe(DisputeEvidenceDocumentType.cancellationPolicy);
    });
  });

  describe('getFileString', () => {
    it('resolves with an ArrayBuffer', async () => {
      const file = new (global as any).File([], 'doc.pdf', { type: 'application/pdf' });
      const doc = new DisputeEvidenceDocument(file, DisputeEvidenceDocumentType.receipt);
      const result = await doc.getFileString();
      expect(result).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe('presignedUrl', () => {
    it('getter returns value set by setter', () => {
      const file = new (global as any).File([], 'doc.pdf');
      const doc = new DisputeEvidenceDocument(file, DisputeEvidenceDocumentType.receipt);
      doc.presignedUrl = 'https://example.com/upload';
      expect(doc.presignedUrl).toBe('https://example.com/upload');
    });
  });
});
