import { Component, h, Prop, State, Watch, Event, EventEmitter, Listen } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { makeGetDispute } from '../../actions/dispute/dispute-actions';
import { DisputeService } from '../../api/services/dispute.service';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { DisputeManagementClickActions } from './event-types';
import { Dispute, DisputeStatus } from '../../api/Dispute';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-dispute-management',
  shadow: true,
})
export class JustifiDisputeManagement {
  @Prop() disputeId!: string;
  @Prop() authToken!: string;

  @State() getDispute: Function;
  @State() dispute: Dispute;
  @State() isLoading: boolean = true;
  @State() showDisputeResponseForm: boolean = false;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  private fetchDisputePending = false;

  private scheduleFetchDispute() {
    if (!this.getDispute || this.fetchDisputePending) {
      return;
    }
    this.fetchDisputePending = true;
    queueMicrotask(() => {
      this.fetchDisputePending = false;
      if (this.getDispute) {
        this.fetchData();
      }
    });
  }

  @Listen('click-event')
  disputeResponseHandler(event: CustomEvent) {
    if (event.detail.name === DisputeManagementClickActions.respondToDispute) {
      this.showDisputeResponseForm = true;
    }
    if (event.detail.name === DisputeManagementClickActions.cancelDispute) {
      this.showDisputeResponseForm = false;
    }
  }

  @Listen('submit-event')
  disputeSubmittedHandler() {
    this.fetchData();
  }

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetDispute();
  }

  componentDidLoad() {
    this.scheduleFetchDispute();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Watch('disputeId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetDispute();
    this.scheduleFetchDispute();
  }

  private initializeGetDispute() {
    if (this.disputeId && this.authToken) {
      this.getDispute = makeGetDispute({
        id: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService(),
      });
    } else {
      this.errorEvent.emit({
        message: 'Dispute ID and Auth Token are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  fetchData(): void {
    if (!this.getDispute) {
      return;
    }
    this.isLoading = true;

    this.getDispute({
      onSuccess: ({ dispute }) => {
        this.dispute = new Dispute(dispute);
        this.isLoading = false;
        if (this.dispute.status !== DisputeStatus.needsResponse) {
          this.showDisputeResponseForm = false;
        }
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
        this.isLoading = false;
      },
    });
  }

  render() {
    return (
      <StyledHost>
        <div>
          {this.showDisputeResponseForm ? (
            <dispute-response
              disputeId={this.disputeId}
              disputeResponse={this.dispute.dispute_response}
              authToken={this.authToken}
            />
          ) : (
            <dispute-notification dispute={this.dispute} authToken={this.authToken} isLoading={this.isLoading} />
          )}
        </div>
      </StyledHost>
    );
  }
}
