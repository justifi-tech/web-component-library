import { Component, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';
import JustifiAnalytics from '../../../api/Analytics';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';
import { makeGetBusiness, makePostProvisioning } from './payment-provisioning-actions';
import { BusinessService } from '../../../api/services/business.service';
import { ProvisionService } from '../../../api/services/provision.service';
import { checkPkgVersion } from '../../../utils/check-pkg-version';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */

@Component({
  tag: 'justifi-payment-provisioning',
})
export class PaymentProvisioning {
  @State() postProvisioning: Function;
  @State() getBusiness: Function;

  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() formTitle?: string = 'Business Information';

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeApi();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.postProvisioning = makePostProvisioning({
        authToken: this.authToken,
        businessId: this.businessId,
        product: 'payment',
        service: new ProvisionService()
      });
    } else {
      this.errorEvent.emit({
        message: 'auth-token and business-id are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  render() {
    return (
      <justifi-payment-provisioning-core
        businessId={this.businessId}
        authToken={this.authToken}
        allowOptionalFields={this.allowOptionalFields}
        formTitle={this.formTitle}
        getBusiness={this.getBusiness}
        postProvisioning={this.postProvisioning}
      />
    );
  }
}
