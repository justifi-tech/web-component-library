// import { Component, h, Prop, State, Event, EventEmitter, Host, Method } from '@stencil/core';

import { Component, Prop, Host, h } from '@stencil/core';
import { FileSelectEvent } from '../../../../api/Document';
import { inputConfigurations } from './input-configurations';
import { isInRange } from '../../../../utils/utils';

@Component({
  tag: 'justifi-business-document-upload-input-group',
  styleUrl: 'business-document-upload-form-step.scss',
  shadow: true,
})
export class BusinessDocumentUploadInputGroup {
  @Prop() paymentVolume: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() storeFiles: (e: CustomEvent<FileSelectEvent>) => void
  @Prop() errors: any;

  inputConfigs = [
    inputConfigurations.voidedCheck,
    inputConfigurations.governmentId,
    inputConfigurations.taxReturn,
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

  render() {
    const inputsConfig = this.getInputGroup();

    return (
      <Host>
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
              error={this.errors[config.name]}
              multiple={true}
            />
          </div>
        ))}
        </div>
      </Host>
    );
  }
}
