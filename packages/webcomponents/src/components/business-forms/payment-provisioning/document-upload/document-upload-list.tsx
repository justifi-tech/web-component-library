import { Component, h, Prop } from '@stencil/core';
import { DocumentUploadStatus, UploadedDocumentEntry } from './document-upload-options';
import { card, heading2, table, tableCell, tableHeadCell } from '../../../../styles/parts';

@Component({
  tag: 'document-upload-list'
})
export class DocumentUploadList {
  @Prop() documents: UploadedDocumentEntry[] = [];

  private renderStatus(status: DocumentUploadStatus) {
    switch (status) {
      case 'uploading':
        return <span class="badge bg-info">Uploading...</span>;
      case 'uploaded':
        return <span class="badge bg-success">Uploaded</span>;
      case 'error':
        return <span class="badge bg-danger">Error</span>;
    }
  }

  render() {
    if (!this.documents.length) {
      return null;
    }

    return (
      <div class="mt-4">
        <div class="card" part={card}>
          <div class="card-body">
            <h5 class="card-title" part={heading2}>Uploaded Documents</h5>
            <div class="table-responsive">
              <table class="table table-sm table-borderless" part={table}>
                <thead>
                  <tr>
                    <th style={{ width: '25%' }} part={tableHeadCell} scope="col">Category</th>
                    <th style={{ width: '25%' }} part={tableHeadCell} scope="col">Document Type</th>
                    <th style={{ width: '30%' }} part={tableHeadCell} scope="col">File Name</th>
                    <th style={{ width: '20%' }} part={tableHeadCell} scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.documents.map((doc, index) => (
                    <tr class={index === 0 ? 'border-bottom border-top' : 'border-bottom'}>
                      <td part={tableCell}>{doc.categoryLabel}</td>
                      <td part={tableCell}>{doc.docTypeLabel}</td>
                      <td part={tableCell}>{doc.fileName}</td>
                      <td part={tableCell}>{this.renderStatus(doc.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
