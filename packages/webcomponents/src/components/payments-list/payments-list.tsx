import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPayments } from '../../actions/payment/get-payments';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { StyledHost } from '../../ui-components';
import { defaultColumnsKeys } from './payments-table';
import { ComponentErrorEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-payments-list',
  shadow: true
})

export class PaymentsList {
  @State() getPayments: Function;
  @State() errorMessage: string = null;

  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetPayments();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  };

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPayments();
  }

  private initializeGetPayments() {
    if (this.accountId && this.authToken) {
      this.getPayments = makeGetPayments({
        id: this.accountId,
        authToken: this.authToken,
        service: new PaymentService()
      });
    } else {
      this.errorMessage = 'Account ID and Auth Token are required';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  handleErrorEvent = (event) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  };

  render() {
    return (
      <StyledHost>
        <payments-list-core
          getPayments={this.getPayments}
          onError-event={this.handleErrorEvent}
          columns={this.columns}
        />
      </StyledHost>
    );
  }
}
