import { Component, h, Prop } from '@stencil/core';
import { BusinessFormClickActions } from '../utils/business-form-types';
import { Button } from '../../_common/button';

@Component({
  tag: 'justifi-payment-provisioning-form-buttons'
})
export class PaymentProvisioningFormButtons {
  @Prop() currentStep: number;
  @Prop() totalSteps: number;
  @Prop() formLoading: boolean;
  @Prop() formDisabled: boolean;
  @Prop() previousStepButtonOnClick: Function;
  @Prop() nextStepButtonOnClick: Function

  get showPreviousStepButton() {
    return this.currentStep > 0;
  }

  get showNextStepButton() {
    return this.currentStep < this.totalSteps;
  }

  get showSubmitButton() {
    return this.currentStep === this.totalSteps;
  }

  render() {
    return (
      <div class='d-flex gap-2'>
        <Button
          variant="secondary"
          type="button"
          clickHandler={() => this.previousStepButtonOnClick()}
          isDisabled={this.formDisabled}
          isHidden={!this.showPreviousStepButton}>
          Previous
        </Button>
        <Button
          variant="primary"
          type="button"
          clickHandler={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.nextStep)}
          isDisabled={this.formDisabled}
          isLoading={this.formLoading}
          isHidden={!this.showNextStepButton}>
          Next
        </Button>
        <Button
          variant="primary"
          type="submit"
          clickHandler={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.submit)}
          isDisabled={this.formDisabled}
          isLoading={this.formLoading}
          isHidden={!this.showSubmitButton}>
          Submit
        </Button>
      </div>
    );
  }
}
