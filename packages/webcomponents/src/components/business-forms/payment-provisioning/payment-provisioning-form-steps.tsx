import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'justifi-payment-provisioning-form-steps'
})
export class PaymentProvisioningFormSteps {
  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() refs: any[];
  @Prop() currentStep: number;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() handleFormLoading: (e: CustomEvent) => void

  @Event() formCompleted: EventEmitter<any>;

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  componentStepMapping = {
    0: () => <justifi-business-core-info-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[0] = el}
      allowOptionalFields={this.allowOptionalFields}
    />,
    1: () => <justifi-legal-address-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[1] = el}
      allowOptionalFields={this.allowOptionalFields}
    />,
    2: () => <justifi-additional-questions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[2] = el}
      allowOptionalFields={this.allowOptionalFields}
    />,
    3: () => <justifi-business-representative-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[3] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    4: () => <justifi-business-owners-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[4] = el}
      allowOptionalFields={this.allowOptionalFields}
    />,
    5: () => <justifi-business-bank-account-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[5] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    6: () => <justifi-business-document-upload-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[6] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    7: () => <justifi-business-terms-conditions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[7] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
      onSubmitted={() => this.formCompleted.emit()}
    />,
  };

  render() {
    return (
      <div class='col-12 mb-4'>
        {this.currentStepComponent}
      </div>
    );
  }
}
