import { Component, h, Prop } from '@stencil/core';
import { BusinessFormClickActions } from '../utils';
import { Button } from '../../../ui-components';

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
          onClick={() => this.previousStepButtonOnClick()}
          disabled={this.formDisabled}
          hidden={!this.showPreviousStepButton}>
          Previous
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.nextStep)}
          disabled={this.formDisabled}
          isLoading={this.formLoading}
          hidden={!this.showNextStepButton}>
          Next
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.submit)}
          disabled={this.formDisabled}
          isLoading={this.formLoading}
          hidden={!this.showSubmitButton}>
          Submit
        </Button>
      </div>
    );
  }
}
