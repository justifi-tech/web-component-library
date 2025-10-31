import { Component, Method, Prop, State, h, Event, EventEmitter, Watch } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { ComponentErrorEvent } from '../../../../api/ComponentEvents';
import { CountryCode } from '../../../../utils/country-codes';

@Component({
  tag: 'justifi-legal-address-form-step'
})
export class LegalAddressFormStep {
  coreComponent: HTMLJustifiLegalAddressFormStepCoreElement;

  @State() getBusiness: Function;
  @State() patchBusiness: Function;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country?: CountryCode;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.coreComponent.validateAndSubmit({ onSuccess });
  }

  componentWillLoad() {
    this.initializeApi();
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.patchBusiness = makePatchBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
    } else {
      this.errorEvent.emit({
        message: 'Missing required props',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  render() {
    return (
      <justifi-legal-address-form-step-core
        getBusiness={this.getBusiness}
        patchBusiness={this.patchBusiness}
        allowOptionalFields={this.allowOptionalFields}
        country={this.country}
        ref={el => this.coreComponent = el}
      />
    );
  }
}
