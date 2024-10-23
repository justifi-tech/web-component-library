import { Component, Event, EventEmitter, h, Listen, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @Event() submit: EventEmitter;

  @State() showCounterDispute: boolean = false;

  @Listen('clickEvent')
  counterDisputeHandler(event: CustomEvent) {
    if (event.detail.name === 'counterDispute') {
      this.showCounterDispute = true;
    }
    if (event.detail.name === 'cancelDispute') {
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
