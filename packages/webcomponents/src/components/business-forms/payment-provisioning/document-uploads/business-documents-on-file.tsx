import { Component, h, Prop } from '@stencil/core';
import { snakeCaseToHumanReadable } from '../../../../utils/utils';

@Component({
  tag: 'justifi-business-documents-on-file'
})
export class BusinessDocumentsOnFile {
  @Prop() documents: any = [];

  componentDidLoad() {
    console.log('Documents on file:', this.documents);
  }

  render() {

    if (this.documents.length <= 0) {
      return null;
    }

    return (
      <div>
        <div class='card'>
          <div class='card-body'>
            <h5 class='card-title'>Documents on File</h5>
            <div class='table-responsive'>
              <table class='table table-sm table-borderless'>
                <thead part="table-head">
                  <tr part='table-head-row'>
                    <th style={{ width: '40%'}} part="table-head-cell" scope='col'>File Name</th>
                    <th style={{ width: '30%' }} part="table-head-cell" scope='col'>File Type</th>
                    <th style={{ width: '30%' }} part="table-head-cell" scope='col'>Document Type</th>
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