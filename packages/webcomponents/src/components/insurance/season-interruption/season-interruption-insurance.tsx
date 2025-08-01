import { Component, Event, EventEmitter, Method, Prop, State, h } from '@stencil/core';
import { InsuranceService } from '../../../api/services/insurance.service';
import { makeGetQuote, makeToggleCoverage } from '../../../actions/insurance/insurance-actions';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';
import JustifiAnalytics from '../../../api/Analytics';
import { checkPkgVersion } from '../../../utils/check-pkg-version';
import { ComponentErrorEvent } from '../../../api/ComponentEvents';
import {
  text,
  textDanger,
  insuranceForm,
  insuranceRadioGroup,
  insuranceHeaderSection,
  insuranceDescriptionSection,
  insuranceFormSection,
  insuranceLegalDisclaimerSection,
  insuranceLoading,
  inputRadio,
  inputRadioChecked,
  inputRadioCheckedFocused,
  inputRadioFocused,
  inputRadioInvalid,
  label,
} from '../../../styles/parts';

@Component({
  tag: 'justifi-season-interruption-insurance',
  shadow: true,
})
export class SeasonInterruptionInsurance {
  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() primaryIdentityFirstName: string;
  @Prop() primaryIdentityLastName: string;
  @Prop() primaryIdentityState: string;
  @Prop() primaryIdentityPostalCode: string;
  @Prop() primaryIdentityCountry: string;
  @Prop() primaryIdentityEmailAddress: string;
  @Prop() policyAttributesInsurableAmount: number;
  @Prop() policyAttributesStartDate?: string;
  @Prop() policyAttributesEndDate?: string;
  @Prop() coveredIdentityFirstName?: string;
  @Prop() coveredIdentityLastName?: string;

  @State() getQuote: Function;
  @State() toggleCoverage: Function;
  @State() quote: any;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  private seasonInterruptionCoreRef?: HTMLJustifiSeasonInterruptionInsuranceCoreElement;

  analytics: JustifiAnalytics;

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    return this.seasonInterruptionCoreRef.validate();
  }

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeServiceMethods();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  private initializeServiceMethods() {
    if (!this.authToken) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: 'Missing authToken',
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.getQuote = makeGetQuote({
      authToken: this.authToken,
      service: new InsuranceService(),
    });

    this.toggleCoverage = makeToggleCoverage({
      authToken: this.authToken,
      service: new InsuranceService(),
    });
  }

  // Join the parts, split on spaces to get individual part names,
  // filter out any extra spaces to be safe, then rejoin properly
  private usedPartsString = [
    text,
    textDanger,
    insuranceForm,
    insuranceRadioGroup,
    insuranceHeaderSection,
    insuranceDescriptionSection,
    insuranceFormSection,
    insuranceLegalDisclaimerSection,
    insuranceLoading,
    inputRadio,
    inputRadioChecked,
    inputRadioCheckedFocused,
    inputRadioFocused,
    inputRadioInvalid,
    label,
  ].join(' ').split(' ').filter(part => part.length > 0).join(', ');

  render() {
    return (
      <justifi-season-interruption-insurance-core
        ref={(el) => (this.seasonInterruptionCoreRef = el)}
        checkout-id={this.checkoutId}
        getQuote={this.getQuote}
        toggleCoverage={this.toggleCoverage}
        primary-identity-first-name={this.primaryIdentityFirstName}
        primary-identity-last-name={this.primaryIdentityLastName}
        primary-identity-state={this.primaryIdentityState}
        primary-identity-postal-code={this.primaryIdentityPostalCode}
        primary-identity-country={this.primaryIdentityCountry}
        primary-identity-email-address={this.primaryIdentityEmailAddress}
        policy-attributes-insurable-amount={this.policyAttributesInsurableAmount}
        policy-attributes-start-date={this.policyAttributesStartDate}
        policy-attributes-end-date={this.policyAttributesEndDate}
        covered-identity-first-name={this.coveredIdentityFirstName}
        covered-identity-last-name={this.coveredIdentityLastName}
        exportparts={this.usedPartsString}
      >
      </justifi-season-interruption-insurance-core>
    );
  }
}
