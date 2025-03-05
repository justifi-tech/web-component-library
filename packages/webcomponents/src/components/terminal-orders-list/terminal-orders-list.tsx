import { Component, h, Prop, State } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { defaultColumnsKeys } from './terminal-orders-table';
import { makeGetTerminalOrders } from '../../actions/terminal/get-terminal-orders';
import { TerminalOrderService } from '../../api/services/terminal_orders.service';

@Component({
  tag: 'justifi-terminal-orders-list',
  shadow: true
})

export class TerminalOrdersList {
  @State() getTerminalOrders: Function;
  @State() errorMessage: string = null;

  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  @Prop() columns?: string = defaultColumnsKeys
  
  componentWillLoad() {
    checkPkgVersion();
    this.initializeGetTerminalOrders();
  }

  private initializeGetTerminalOrders() {
    if (this.accountId && this.authToken) {
      this.getTerminalOrders = makeGetTerminalOrders({
        id: this.accountId,
        authToken: this.authToken,
        service: new TerminalOrderService(),
        apiOrigin: this.apiOrigin
      });
    } else {
      this.errorMessage = 'Business ID and Auth Token are required';
    }
  }

  render() {
    return (
      <StyledHost>
        <terminal-orders-list-core 
          getTerminalOrders={this.getTerminalOrders} 
          columns={this.columns}
        />
      </StyledHost>
    );
  }
}
