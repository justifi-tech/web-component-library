import { Component, h, Prop } from '@stencil/core';
import { DocumentUploadStatus, UploadedDocumentEntry } from './document-upload-options';
import { card, heading2, table, tableCell, tableHeadCell } from '../../../../styles/parts';

@Component({
  tag: 'document-upload-list'
})
export class DocumentUploadList {
  @Prop() documents: UploadedDocumentEntry[] = [];
  @Prop() removeHandler!: (index: number) => void;
  @Prop() uploadAllHandler!: () => void;

  private get hasUploadableDocuments() {
    return this.documents.some(d => d.status === 'pending' || d.status === 'error');
  }

  private get isUploading() {
    return this.documents.some(d => d.status === 'uploading');
  }

  private renderStatus(status: DocumentUploadStatus) {
    switch (status) {
      case 'pending':
        return <span class="badge bg-secondary">Pending</span>;
      case 'uploading':
        return <span class="badge bg-info">Uploading...</span>;
      case 'uploaded':
        return <span class="badge bg-success">Uploaded</span>;
      case 'error':
        return <span class="badge bg-danger">Error</span>;
    }
  }

  private renderActions(doc: UploadedDocumentEntry, index: number) {
    if (doc.status === 'pending') {
      return (
        <button
          type="button"
          class="btn btn-link btn-sm text-danger p-0"
          onClick={() => this.removeHandler(index)}
        >
          Remove
        </button>
      );
    }
    return null;
  }

  render() {
    if (!this.documents.length) {
      return null;
    }

    return (
      <div class="mt-4">
        <div class="card" part={card}>
          <div class="card-body">
            <h5 class="card-title" part={heading2}>Document Queue</h5>
            <div class="table-responsive">
              <table class="table table-sm table-borderless" part={table}>
                <thead>
                  <tr>
                    <th style={{ width: '20%' }} part={tableHeadCell} scope="col">Category</th>
                    <th style={{ width: '20%' }} part={tableHeadCell} scope="col">Document Type</th>
                    <th style={{ width: '25%' }} part={tableHeadCell} scope="col">File Name</th>
                    <th style={{ width: '15%' }} part={tableHeadCell} scope="col">Status</th>
                    <th style={{ width: '20%' }} part={tableHeadCell} scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.documents.map((doc, index) => (
                    <tr class={index === 0 ? 'border-bottom border-top' : 'border-bottom'}>
                      <td part={tableCell}>{doc.categoryLabel}</td>
                      <td part={tableCell}>{doc.docTypeLabel}</td>
                      <td part={tableCell}>{doc.fileName}</td>
                      <td part={tableCell}>{this.renderStatus(doc.status)}</td>
                      <td part={tableCell}>{this.renderActions(doc, index)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {this.hasUploadableDocuments && (
              <div class="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  onClick={() => this.uploadAllHandler()}
                  disabled={this.isUploading}
                >
                  {this.isUploading ? 'Uploading...' : 'Upload All'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
