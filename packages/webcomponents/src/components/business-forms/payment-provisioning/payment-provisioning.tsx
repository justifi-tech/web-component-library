import { Component, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';
import JustifiAnalytics from '../../../api/Analytics';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';
import { makeGetBusiness, makePostProvisioning } from './payment-provisioning-actions';
import { BusinessService } from '../../../api/services/business.service';
import { ProvisionService } from '../../../api/services/provision.service';
import { checkPkgVersion } from '../../../utils/check-pkg-version';

/**
 * @exportedPart header-1: The header 1
 * @exportedPart header-2: The header 2
 * @exportedPart header-3: The header 3
 * @exportedPart label: Label for inputs
 * @exportedPart radio-input-label: 
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 * @exportedPart radio-input: The radio input fields
 * @exportedPart radio-input-checked: The checked radio input fields
 * @exportedPart radio-input-invalid: The invalid radio input fields
 * @exportedPart input-group: The input group
 * @exportedPart input-group-input: The input fields in a group
 * @exportedPart input-group-text: The text in a group (e.g. $ sign in a currency input)
 * @exportedPart input-help-text: The help text for the input
 * @exportedPart input-error-text: The error text for the input
 * @exportedPart form-check-input: The form check input
 * @exportedPart form-check-input-checked: The checked form check input
 * @exportedPart button: The button
 * @exportedPart button-spinner: The spinner for the button
 * @exportedPart button-primary: The primary button
 * @exportedPart button-secondary: The secondary button
 * @exportedPart card: The card
 * @exportedPart card-body: The card body
 * @exportedPart card-title: The card title
 * @exportedPart table: The table
 * @exportedPart table-head: The table head
 * @exportedPart table-head-row: The table head row
 * @exportedPart table-head-cell: The table head cell
 * @exportedPart table-body: The table body
 * @exportedPart table-cell: The table body cell
 */

@Component({
  tag: 'justifi-payment-provisioning',
  shadow: true,
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
