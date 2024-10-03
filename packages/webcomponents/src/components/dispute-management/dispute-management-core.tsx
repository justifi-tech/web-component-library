import { Component, h, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @State() isDisputeNotificationVisible = true;

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
