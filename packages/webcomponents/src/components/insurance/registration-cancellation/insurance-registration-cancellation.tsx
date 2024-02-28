import { Component, h, Prop } from '@stencil/core';
import { quote } from '../shared/mockData';

@Component({
  tag: 'justifi-insurance-registration-cancellation',
  shadow: true,
})

export class InsuranceRegistrationCancellation {
  @Prop() customerEmailAddress: string;

  render() {
    <div>
      <justifi-insurance-header></justifi-insurance-header>
      <justifi-insurance-description></justifi-insurance-description>
      <justifi-insurance-opt-in></justifi-insurance-opt-in>
      <justifi-insurance-legal>{quote.product.legal_disclaimer}</justifi-insurance-legal>
    </div>
  };
};