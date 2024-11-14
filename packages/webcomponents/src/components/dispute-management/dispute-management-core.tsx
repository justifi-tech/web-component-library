import { Component, Event, EventEmitter, h, Listen, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";
import { DisputeManagementClickEvents } from "./dispute";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @Event() submitted: EventEmitter;

  @State() showCounterDispute: boolean = false;

  @Listen('clickEvent')
  counterDisputeHandler(event: CustomEvent) {
    if (event.detail.name === DisputeManagementClickEvents.counterDispute) {
      this.showCounterDispute = true;
    }
    if (event.detail.name === DisputeManagementClickEvents.cancelDispute) {
      this.showCounterDispute = false;
    }
  }

  render() {
    return (
      <StyledHost>
        {this.showCounterDispute ? <justifi-counter-dispute /> : <justifi-dispute-notification />}
      </StyledHost>
    );
  }
};
