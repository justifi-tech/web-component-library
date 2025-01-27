import { Component, h, Prop } from '@stencil/core';
import { EntityDocumentType, FileSelectEvent } from '../../../../api';

@Component({
  tag: 'bank-account-document-form-inputs'
})
export class BankAccountDocumentFormInputs {
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() errors: any;
  @Prop() storeFiles: (e: CustomEvent<FileSelectEvent>) => void;

  render() {
    return (
      <div class="row gy-3">
        <div class="col-12">
          <form-control-file
            name="voided_check"
            label="Voided Check"
            documentType={EntityDocumentType.voidedCheck}
            inputHandler={this.inputHandler}
            onFileSelected={this.storeFiles}
            errorText={this.errors["voided_check"]}
            multiple={true}
          />
        </div>
        <div class="col-12">
          <form-control-file
            name="bank_statement"
            label="Bank Statement"
            documentType={EntityDocumentType.bankStatement}
            inputHandler={this.inputHandler}
            onFileSelected={this.storeFiles}
            errorText={this.errors["bank_statement"]}
            multiple={true}
          />
        </div>
      </div>
    )
  }
}
