import { Component, h, Prop } from '@stencil/core';
import { CountryCode } from '../../../utils/country-codes';

@Component({
  tag: 'justifi-payment-provisioning-form-steps'
})
export class PaymentProvisioningFormSteps {
  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() refs: any[];
  @Prop() currentStep: number;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() country?: CountryCode = CountryCode.USA;
  @Prop() handleFormLoading: (e: CustomEvent) => void

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  componentStepMapping = {
    0: () => <justifi-business-core-info-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[0] = el}
      allowOptionalFields={this.allowOptionalFields}
      country={this.country}
    />,
    1: () => <justifi-legal-address-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[1] = el}
      allowOptionalFields={this.allowOptionalFields}
      country={this.country}
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
      allowOptionalFields={this.allowOptionalFields}
      country={this.country}
    />,
    4: () => <justifi-business-owners-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[4] = el}
      allowOptionalFields={this.allowOptionalFields}
      country={this.country}
    />,
    5: () => this.getBankAccountStepFor(this.country),
    6: () => <justifi-business-terms-conditions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[6] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
  };

  getBankAccountStepFor = (country: CountryCode) => {
    if (country === CountryCode.CAN) {
      return (
        <justifi-business-bank-account-form-step-canada
          businessId={this.businessId}
          authToken={this.authToken}
          ref={(el) => this.refs[5] = el}
          allowOptionalFields={this.allowOptionalFields}
        />
      );
    }
    return (
      <justifi-business-bank-account-form-step
        businessId={this.businessId}
        authToken={this.authToken}
        ref={(el) => this.refs[5] = el}
        allowOptionalFields={this.allowOptionalFields}
      />
    );
  }

  render() {
    return (
      <div class='col-12 mb-4'>
        {this.currentStepComponent}
      </div>
    );
  }
}
