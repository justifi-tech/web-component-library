import { Component, h, Listen, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";

@Component({
  tag: 'justifi-dispute-management-core',
})
export class DisputeManagementCore {
  @State() currentStep = 0;
  @State() refs: any[] = [];

  @Listen('updateStep')
  updateStepHandler(event: CustomEvent<{ step: 'submit' | 'next' | 'back' }>) {
    if (event.detail.step === 'next') {
      this.currentStep = this.currentStep + 1;
    }
    if (event.detail.step === 'back') {
      this.currentStep = this.currentStep - 1;
    }
    if (event.detail.step === 'submit') {
      // submit form
      console.log('submit form');
    }
  }

  componentStepMapping = [
    () => <justifi-dispute-notification ref={(el) => this.refs[0] = el}></justifi-dispute-notification>,
    () => <justifi-upload-dispute-evidence ref={(el) => this.refs[1] = el}></justifi-upload-dispute-evidence>,
  ];

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  render() {
    return (
      <StyledHost>
        {this.currentStepComponent}
      </StyledHost>
    );
  }
};
