import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { ErrorState } from '../../ui-components/details/utils';
import { BusinessService } from '../../api/services/business.service';
import { makeGetBusiness } from './get-business';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';

@Component({
  tag: 'justifi-business-details',
  shadow: true,
})
export class BusinessDetails {
  @Prop() businessId: string;
  @Prop() authToken: string;

  @State() errorMessage: string;
  @State() getBusiness: Function;

  analytics: JustifiAnalytics;

  @Event({
    eventName: 'error-event'
  }) errorEvent: EventEmitter<ComponentError>;


  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetBusiness();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  private initializeGetBusiness() {
    if (!this.businessId || !this.authToken) {
      this.errorMessage = 'Invalid business id or auth token';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.getBusiness = makeGetBusiness({
      id: this.businessId,
      authToken: this.authToken,
      service: new BusinessService(),
    });
  }

  render() {
    if (this.errorMessage) {
      return <Host>{ErrorState(this.errorMessage)}</Host>;
    }
    return (
      <Host>
        <business-details-core getBusiness={this.getBusiness} />
      </Host>
    );
  }
}
