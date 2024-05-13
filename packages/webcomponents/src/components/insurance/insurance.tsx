import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { ErrorState } from '../details/utils';
import { InsuranceService } from '../../api/services/insurance.service';
import { makeGetQuote } from './insurance-actions';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';


@Component({
  tag: 'justifi-insurance',
  shadow: true,
})
export class Insurance {
  @Prop() authToken: string;
  @Prop() quoteId: string;

  @State() errorMessage: string;
  @State() getQuote: Function;
  @State() quote: any;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.initializeGetQuote();
  }

  private initializeGetQuote() {
    if (!this.authToken) {
      this.errorMessage = 'Invalid auth token';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.getQuote = makeGetQuote({
      authToken: this.authToken,
      quoteId: this.quoteId,
      service: new InsuranceService(),
    });
  }

  render() {
    if (this.errorMessage) {
      return <Host>{ErrorState(this.errorMessage)}</Host>;
    }
    return (
      <Host>
        {JSON.stringify(this.quote)}
      </Host>
    );
  }
}
