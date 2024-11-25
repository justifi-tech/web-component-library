import { Component, h, Watch, State, Prop, Event, EventEmitter } from "@stencil/core";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import { config } from '../../../../config';
import JustifiAnalytics from "../../../api/Analytics";
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from "../../../api/ComponentError";
import { StyledHost } from "../../../ui-components";
import { DisputeService } from "../../../api/services/dispute.service";
import { makeUpdateDisputeResponse } from "./dispute-response-actions";

@Component({
  tag: 'justifi-dispute-response',
  shadow: true
})
export class DisputeResponse {
  @State() updateDisputeResponse: Function;
  @State() errorMessage: string = null;

  @Prop() authToken: string;
  @Prop() disputeId: string;
  @Prop() apiOrigin?: string = config.proxyApiOrigin;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeUpdateDisputeResponse();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeUpdateDisputeResponse();
  }

  private initializeUpdateDisputeResponse() {
    if (this.disputeId && this.authToken) {
      this.updateDisputeResponse = makeUpdateDisputeResponse({
        disputeId: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService()
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
        <justifi-dispute-response-core
          onError-event={this.handleErrorEvent}
          dispute-id={this.disputeId}
          updateDisputeResponse={this.updateDisputeResponse}
        />
        this.updateDisputeResponse: {JSON.stringify(this.updateDisputeResponse)}
      </StyledHost>
    )
  };
};