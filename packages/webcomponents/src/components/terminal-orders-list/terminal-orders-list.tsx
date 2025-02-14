import { Component, h, Prop, State } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { defaultColumnsKeys } from './terminal-orders-table';

@Component({
  tag: 'justifi-terminal-orders-list',
  shadow: true
})

export class TerminalOrdersList {
  @State() getTerminalOrders: Function;
  @State() errorMessage: string = null;

  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  @Prop() columns?: string = defaultColumnsKeys
  
  componentWillLoad() {
    checkPkgVersion();
    this.initializeGetTerminalOrders();
  }

  private initializeGetTerminalOrders() {
    if (this.businessId && this.authToken) {
      this.getTerminalOrders = () => {
        console.log('getTerminalOrders');
      }
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
