import { Component, h, Prop, State, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { ComponentErrorEvent } from '../../../../api/ComponentEvents';

@Component({
  tag: 'justifi-business-representative-form-step'
})
export class BusinessRepresentativeFormStep {
  coreComponent: HTMLJustifiBusinessRepresentativeFormStepCoreElement;

  @State() getBusiness: Function;
  @State() patchBusiness: Function;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;

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
      <justifi-business-representative-form-step-core 
        getBusiness={this.getBusiness}
        patchBusiness={this.patchBusiness}
        allowOptionalFields={this.allowOptionalFields}
        ref={el => this.coreComponent = el}
      />
    );
  }
};
