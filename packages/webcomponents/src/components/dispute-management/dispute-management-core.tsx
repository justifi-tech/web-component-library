import { Component, h, Listen, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @State() isDisputeNotificationVisible = true;

  @Listen('disputeAction')
  disputeActionHandler(event: CustomEvent<{ accept?: boolean, challenge?: boolean }>) {
    if (event.detail.challenge) {
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
          <justifi-challenge-dispute></justifi-challenge-dispute>
        )}
      </StyledHost>
    );
  }
};
