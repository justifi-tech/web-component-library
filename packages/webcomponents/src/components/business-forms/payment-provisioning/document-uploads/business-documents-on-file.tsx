import { Component, h, Prop } from '@stencil/core';
import { formatDate, formatTimeSeconds, snakeCaseToHumanReadable } from '../../../../utils/utils';

@Component({
  tag: 'justifi-business-documents-on-file'
})
export class BusinessDocumentsOnFile {
  @Prop() documents: any = [];

  render() {

    if (!this.documents.length) {
      return null;
    }

    return (
      <div>
        <div class='card'>
          <div class='card-body'>
            <h5 class='card-title'>Documents Already on File</h5>
            <div class='table-responsive'>
              <table class='table table-sm table-borderless'>
                <thead part="table-head">
                  <tr part='table-head-row'>
                    <th style={{ width: '25%'}} part="table-head-cell" scope='col'>File Name</th>
                    <th style={{ width: '25%' }} part="table-head-cell" scope='col'>File Type</th>
                    <th style={{ width: '25%' }} part="table-head-cell" scope='col'>Document Type</th>
                    <th style={{ width: '25%' }} part="table-head-cell" scope='col'>Date Uploaded</th>
                  </tr>
                </thead>
                <tbody part='table-body'>
                  {this.documents.sort((a: any, b: any) => a.document_type.localeCompare(b.document_type))
                    .map((document: any, index) => {
                    return (
                      <tr class={index === 0 ? 'row-border first-row' : 'row-border'}>
                        <td part="table-cell">{document.file_name}</td>
                        <td part="table-cell">{document.file_type}</td>
                        <td part="table-cell">{snakeCaseToHumanReadable(document.document_type)}</td>
                        <td part="table-cell">{`${formatDate(document.created_at)} - ${formatTimeSeconds(document.created_at)}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}