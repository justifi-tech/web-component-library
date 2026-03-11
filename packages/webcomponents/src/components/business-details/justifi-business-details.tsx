import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { Business } from '../../api/Business';
import { ErrorState } from '../../ui-components/details/utils';
import { BusinessService } from '../../api/services/business.service';
import { makeGetBusiness } from '../../actions/business/get-business';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { StyledHost } from '../../ui-components';
import { BusinessDetailsLoading } from './business-details-loading';

@Component({
  tag: 'justifi-business-details',
  shadow: true,
})
export class JustifiBusinessDetails {
  @Prop() businessId!: string;
  @Prop() authToken!: string;

  @State() getBusiness: Function;
  @State() business: Business;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  analytics: JustifiAnalytics;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetBusiness();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  };

  @Watch('businessId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetBusiness();
  }

  private initializeGetBusiness() {
    if (this.businessId && this.authToken) {
      this.getBusiness = makeGetBusiness({
        id: this.businessId,
        authToken: this.authToken,
        service: new BusinessService(),
      });
      this.fetchData();
    } else {
      this.errorMessage = 'Invalid business id or auth token';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  @Watch('getBusiness')
  updateOnPropChange() {
    if (this.getBusiness) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.loading = true;

    this.getBusiness({
      onSuccess: ({ business }) => {
        this.business = business;
        this.errorMessage = null;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      },
      final: () => {
        this.loading = false;
      },
    });
  }

  render() {
    return (
      <StyledHost>
        {this.loading && <BusinessDetailsLoading />}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && !this.errorMessage && this.business && (
          <justifi-details errorMessage={this.errorMessage}>
            <div slot='detail-sections'>
              <core-info-details business={this.business} />
              <legal-address-details legalAddress={this.business.legal_address} />
              <representative-details representative={this.business.representative} />
              <owner-details owners={this.business.owners} />
              <additional-questions-details
                additionalQuestions={this.business.additional_questions}
              />
            </div>
          </justifi-details>
        )}
      </StyledHost>
    );
  }
}
