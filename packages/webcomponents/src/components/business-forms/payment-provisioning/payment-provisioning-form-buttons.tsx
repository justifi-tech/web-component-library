import { Component, h, Prop } from '@stencil/core';
import { BusinessFormClickActions } from '../utils/business-form-types';
import { LoadingSpinner } from '../../form/utils';

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
        <button
          type='button'
          class='btn btn-secondary'
          onClick={() => this.previousStepButtonOnClick()}
          disabled={this.formDisabled}
          hidden={!this.showPreviousStepButton}>
          Previous
        </button>
        <button
          type='button'
          class={`btn btn-primary jfi-submit-button${this.formLoading ? ' jfi-submit-button-loading' : ''}`}
          onClick={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.nextStep)}
          disabled={this.formDisabled}
          hidden={!this.showNextStepButton}>
          {this.formLoading ? LoadingSpinner() : 'Next'}
        </button>
        <button
          type='submit'
          class={`btn btn-primary jfi-submit-button${this.formLoading ? ' jfi-submit-button-loading' : ''}`}
          onClick={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.submit)}
          disabled={this.formDisabled}
          hidden={!this.showSubmitButton}>
          {this.formLoading ? LoadingSpinner() : 'Submit'}
        </button>
      </div>
    );
  }
}
