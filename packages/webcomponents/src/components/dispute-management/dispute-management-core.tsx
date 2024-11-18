import { Component, Event, EventEmitter, h, Listen, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";
import { DisputeManagementClickEvents } from "./dispute";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @Event() submitted: EventEmitter;

  @State() showDisputeResponseForm: boolean = false;

  @Listen('clickEvent')
  disputeResponseHandler(event: CustomEvent) {
    if (event.detail.name === DisputeManagementClickEvents.respondToDispute) {
      this.showDisputeResponseForm = true;
    }
    if (event.detail.name === DisputeManagementClickEvents.cancelDispute) {
      this.showDisputeResponseForm = false;
    }
  }

  render() {
    return (
      <StyledHost>
        {this.showDisputeResponseForm ? <justifi-dispute-response /> : <justifi-dispute-notification />}
      </StyledHost>
    );
  }
};
