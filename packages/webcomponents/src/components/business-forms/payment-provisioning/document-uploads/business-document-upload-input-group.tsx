import { Component, Prop, h } from '@stencil/core';
import { inputConfigurations } from './input-configurations';
import { isInRange } from '../../../../utils/utils';
import { FileSelectEvent } from '../../../form/form-control-file';

@Component({
  tag: 'justifi-business-document-upload-input-group'
})
export class BusinessDocumentUploadInputGroup {
  @Prop() paymentVolume: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() storeFiles: (e: CustomEvent<FileSelectEvent>) => void
  @Prop() errors: any;

  inputConfigs = [
    inputConfigurations.voidedCheck,
    inputConfigurations.governmentId,
    inputConfigurations.ss4,
    inputConfigurations.other,
  ];

  getInputGroup() {
    let volume = parseInt(this.paymentVolume)

    if (isInRange(volume, 250000, 999999)) {
      this.inputConfigs.unshift(inputConfigurations.bankStatements)
    } else if (volume >= 1000000) {
      this.inputConfigs.unshift(
        inputConfigurations.balanceSheet,
        inputConfigurations.profitAndLossStatement,
        inputConfigurations.bankStatements
      )
    }

    return this.inputConfigs;
  }

  componentWillLoad() {
    this.getInputGroup();
  }

  render() {
    const inputsConfig = this.inputConfigs;

    return (
      <div class="row gy-3">
        {inputsConfig.map(config => (
          <div class="col-12 col-md-6">
            <form-control-file
              name={config.name}
              label={config.label}
              helpText={config.helpText}
              documentType={config.documentType}
              inputHandler={this.inputHandler}
              onFileSelected={this.storeFiles}
              errorText={this.errors[config.name]}
              multiple={true}
            />
          </div>
        ))}
      </div>
    );
  }
}
