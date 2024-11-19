import { Component, Prop, Event, EventEmitter, h, Listen, State, Watch } from "@stencil/core";
import { DisputeManagementClickEvents } from "./dispute";
import { Dispute } from "../../api/Dispute";
import { ComponentError } from "../../api/ComponentError";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @Prop() getDispute: Function;

  @State() dispute: Dispute;
  @State() loading: boolean = true;
  @State() errorMessage: string;
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
    this.loading = true;

    this.getDispute({
      onSuccess: ({ dispute }) => {
        this.dispute = dispute;
        this.loading = false;
        this.errorMessage = null;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
        this.loading = false;
      },
    });
  }

  render() {
    return (
      <div>
        {this.showDisputeResponseForm ? <justifi-dispute-response /> : <justifi-dispute-notification />}
        Dispute: {JSON.stringify(this.dispute)}
      </div>
    );
  }
};
