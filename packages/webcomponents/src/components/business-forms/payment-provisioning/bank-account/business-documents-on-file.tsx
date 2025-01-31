import { Component, h, Host, Prop } from '@stencil/core';
import { formatDate, formatTimeSeconds, snakeCaseToHumanReadable } from '../../../../utils/utils';
import { card, heading2, table, tableCell, tableHeadCell } from '../../../../styles/parts';
import { Skeleton } from '../../../../ui-components';

@Component({
  tag: 'business-documents-on-file'
})
export class BusinessDocumentsOnFile {
  @Prop() documents: any = [];
  @Prop() isLoading: boolean = false;

  render() {

    if (this.isLoading) {
      return <Skeleton height={"50px"} />;
    }

    if (!this.documents.length) {
      return null;
    }

    return (
      <Host>
        <div class="card" part={card}>
          <div class="card-body">
            <h5 class="card-title" part={heading2}>Documents Already on File</h5>
            <div class="table-responsive">
              <table class="table table-sm table-borderless" part={table}>
                <thead>
                  <tr>
                    <th style={{ width: "25%" }} part={tableHeadCell} scope="col">File Name</th>
                    <th style={{ width: "25%" }} part={tableHeadCell} scope="col">File Type</th>
                    <th style={{ width: "25%" }} part={tableHeadCell} scope="col">Document Type</th>
                    <th style={{ width: "25%" }} part={tableHeadCell} scope="col">Date Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {this.documents.sort((a: any, b: any) => a.document_type.localeCompare(b.document_type))
                    .map((document: any, index) => {
                      return (
                        <tr class={index === 0 ? "border-bottom border-top" : "border-bottom"}>
                          <td part={tableCell} >{document.file_name}</td>
                          <td part={tableCell} >{document.file_type}</td>
                          <td part={tableCell} >{snakeCaseToHumanReadable(document.document_type)}</td>
                          <td part={tableCell} >{`${formatDate(document.created_at)} - ${formatTimeSeconds(document.created_at)}`}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <hr />
      </Host>
    );
  }
}
