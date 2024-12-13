import { Component, Prop, Event, EventEmitter, h, Listen, State, Watch } from "@stencil/core";
import { DisputeManagementClickEvents } from "./dispute";
import { Dispute } from "../../api/Dispute";
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
  @Event() submitted: EventEmitter;

  @Listen('clickEvent')
  disputeResponseHandler(event: CustomEvent) {
    if (event.detail.name === DisputeManagementClickEvents.respondToDispute) {
      this.showDisputeResponseForm = true;
    }
    if (event.detail.name === DisputeManagementClickEvents.cancelDispute) {
      this.showDisputeResponseForm = false;
    }
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
        this.dispute = dispute;
        this.isLoading = false;
        if (this.dispute.status == 'won' || this.dispute.status == 'lost') {
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
            isLoading={this.isLoading}
          />
        )}
      </div>
    );
  }
};
