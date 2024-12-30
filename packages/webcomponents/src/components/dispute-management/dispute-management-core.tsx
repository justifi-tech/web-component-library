import { Component, Prop, Event, EventEmitter, h, Listen, State, Watch } from "@stencil/core";
import { DisputeManagementClickEventNames } from "./dispute";
import { Dispute, DisputeStatus } from "../../api/Dispute";
import { ComponentError } from "../../api/ComponentError";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @Prop() getDispute: Function;
  @Prop() disputeId: string;
  @Prop() authToken: string;

  @State() dispute: Dispute;
  @State() isLoading: boolean = true;
  @State() showDisputeResponseForm: boolean = false;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>

  @Listen('click-event')
  disputeResponseHandler(event: CustomEvent) {
    if (event.detail.name === DisputeManagementClickEventNames.respondToDispute) {
      this.showDisputeResponseForm = true;
    }
    if (event.detail.name === DisputeManagementClickEventNames.cancelDispute) {
      this.showDisputeResponseForm = false;
    }
  }

  @Listen('submit-event')
  disputeSubmittedHandler() {
    this.fetchData();
  }

  componentWillLoad() {
    if (this.getDispute) {
      this.fetchData();
    }
  }

  @Watch('getDispute')
  updateOnPropChange() {
    this.fetchData();
  }

  fetchData(): void {
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
        })
        this.isLoading = false;
      },
    });
  }

  render() {
    return (
      <div>
        {this.showDisputeResponseForm ? (
          <justifi-dispute-response
            disputeId={this.disputeId}
            disputeResponse={this.dispute.dispute_response}
            authToken={this.authToken}
          />
        ) : (
          <justifi-dispute-notification
            dispute={this.dispute}
            authToken={this.authToken}
            isLoading={this.isLoading}
          />
        )}
      </div>
    );
  }
};
