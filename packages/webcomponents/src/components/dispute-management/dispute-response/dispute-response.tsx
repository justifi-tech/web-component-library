import { Component, h, Watch, State, Prop, Event, EventEmitter } from "@stencil/core";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import { config } from '../../../../config';
import { StyledHost } from "../../../ui-components";
import { makeCreateDisputeEvidence, makeUpdateDisputeResponse, makeSubmitDisputeResponse } from "./dispute-response-actions";
import { IDispute } from "../../../components";
import { IApiResponse } from "../../../api";
import JustifiAnalytics from "../../../api/Analytics";
import { ComponentErrorCodes, ComponentErrorSeverity } from "../../../api/ComponentError";
import { DisputeService } from "../../../api/services/dispute.service";
import { ComponentErrorEvent } from "../../../api/ComponentEvents";

@Component({
  tag: 'justifi-dispute-response',
  shadow: true
})
export class DisputeResponse {
  @State() updateDisputeResponse: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<IDispute>>;
  @State() submitDisputeResponse: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<IDispute>>;
  @State() createDisputeEvidence: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<any>>;
  @State() errorMessage: string = null;

  @Prop() authToken: string;
  @Prop() disputeId: string;
  @Prop() disputeResponse: DisputeResponse;
  @Prop() apiOrigin?: string = config.proxyApiOrigin;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeDisputeServiceMethods();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeDisputeServiceMethods();
  }

  private initializeDisputeServiceMethods() {
    if (this.disputeId && this.authToken) {
      this.updateDisputeResponse = makeUpdateDisputeResponse({
        disputeId: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService()
      });
      this.createDisputeEvidence = makeCreateDisputeEvidence({
        disputeId: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService()
      });
      this.submitDisputeResponse = makeSubmitDisputeResponse({
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
          disputeResponse={this.disputeResponse}
          createDisputeEvidence={this.createDisputeEvidence}
          updateDisputeResponse={this.updateDisputeResponse}
          submitDisputeResponse={this.submitDisputeResponse}
        />
      </StyledHost>
    )
  };
};