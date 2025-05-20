import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { defaultColumnsKeys } from './terminal-orders-table';
import { makeGetTerminalOrders } from '../../actions/terminal/get-terminal-orders';
import { TerminalOrderService } from '../../api/services/terminal_orders.service';
import { ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity } from '../../api';
import JustifiAnalytics from '../../api/Analytics';

@Component({
  tag: 'justifi-terminal-orders-list',
  shadow: true
})

export class TerminalOrdersList {
  @State() getTerminalOrders: Function;
  @State() errorMessage: string = null;

  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() columns?: string = defaultColumnsKeys

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetData();
  }

  disconnectedCallback() {
    this.analytics && this.analytics.cleanup();
  };

  private initializeGetData() {
    if (this.accountId && this.authToken) {
      this.getTerminalOrders = makeGetTerminalOrders({
        id: this.accountId,
        authToken: this.authToken,
        service: new TerminalOrderService()
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
        <terminal-orders-list-core
          getTerminalOrders={this.getTerminalOrders}
          onError-event={this.handleErrorEvent}
          columns={this.columns}
        />
      </StyledHost>
    );
  }
}
