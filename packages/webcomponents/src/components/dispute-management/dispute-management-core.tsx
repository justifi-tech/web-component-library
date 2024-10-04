import { Component, h, Listen, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @State() isDisputeNotificationVisible = true;

  @Listen('disputeAction')
  disputeActionHandler(event: CustomEvent<{ accept?: boolean, counter?: boolean }>) {
    if (event.detail.counter) {
      this.isDisputeNotificationVisible = false;
    }
    if (event.detail.accept) {
      console.log('accept dispute');
    }
  }

  render() {
    return (
      <StyledHost>
        {this.isDisputeNotificationVisible ? (
          <justifi-dispute-notification></justifi-dispute-notification>
        ) : (
          <justifi-counter-dispute></justifi-counter-dispute>
        )}
      </StyledHost>
    );
  }
};
