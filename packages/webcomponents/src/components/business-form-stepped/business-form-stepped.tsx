import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormAlert } from '../form/utils';
import { ClickEvents } from './BusinessFormEventTypes';
/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */

@Component({
  tag: 'justifi-business-form-stepped',
  styleUrl: 'business-form-stepped.scss',
})
export class BusinessFormStepped {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() testMode: boolean = false;
  @Prop() hideErrors?: boolean = false;
  @State() formLoading: boolean = false;
  @State() currentStep: number = 0;
  @State() totalSteps: number = 4;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';
  @Event() clickEvent: EventEmitter<{ data?: any, name: string }>;

  constructor() {
    this.incrementSteps = this.incrementSteps.bind(this);
    this.decrementSteps = this.decrementSteps.bind(this);
  }

  get disabledState() {
    return this.formLoading;
  }

  get showErrors() {
    return this.serverError && !this.hideErrors;
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private coreInfoRef: any;
  private legalAddressRef: any;
  private additionalQuestionsRef: any;
  private representativeRef: any;
  private refs = [];

  componentStepMapping = {
    0: () => <justifi-business-core-info-form-step ref={(el) => this.refs[0] = el} authToken={this.authToken} businessId={this.businessId} isLoading={this.formLoading} />,
    1: () => <justifi-legal-address-form-step ref={(el) => this.refs[1] = el} authToken={this.authToken} businessId={this.businessId} isLoading={this.formLoading} />,
    2: () => <justifi-additional-questions-form-step ref={(el) => this.refs[2] = el} authToken={this.authToken} businessId={this.businessId} isLoading={this.formLoading} />,
    3: () => <justifi-business-representative-form-step ref={(el) => this.refs[3] = el} authToken={this.authToken} businessId={this.businessId} isLoading={this.formLoading} />
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.refs = [this.coreInfoRef, this.legalAddressRef, this.additionalQuestionsRef, this.representativeRef];
    this.totalSteps = Object.keys(this.componentStepMapping).length - 1;
  }

  showPreviousStepButton() {
    return this.currentStep > 0;
  }

  showNextStepButton() {
    return this.currentStep < this.totalSteps;
  }

  incrementSteps() { 
    if (this.currentStep < this.totalSteps) {
      return this.currentStep++; 
    }
  }
  decrementSteps() { return this.currentStep--; }

  previousStepButtonOnClick() {
    this.clickEvent.emit({ name: ClickEvents.previousStep })
    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit(this.decrementSteps);
  }

  nextStepButtonOnClick(e: any, clickEventName) {
    e.preventDefault();
    this.clickEvent.emit({ name: clickEventName })

    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit(this.incrementSteps);
  }

  showSubmitButton() {
    return this.currentStep === this.totalSteps;
  }

  currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        {this.showErrors && FormAlert(this.errorMessage)}
        <div class="my-4">
          {this.currentStepComponent()}
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            Step {this.currentStep + 1} of {this.totalSteps + 1}
          </div>
          <div class="d-flex gap-2">
            {this.showPreviousStepButton() && (
              <button
                type="button"
                class="btn btn-secondary"
                onClick={() => this.previousStepButtonOnClick()}
                disabled={this.formLoading}>
                Previous
              </button>
            )}
            {this.showNextStepButton() && (
              <button
                type="button"
                class="btn btn-primary"
                onClick={(e) => this.nextStepButtonOnClick(e, ClickEvents.nextStep)}
                disabled={this.disabledState || this.formLoading}>
                Next
              </button>
            )}
            {this.showSubmitButton() && (
              <button
                type="submit"
                class="btn btn-primary"
                onClick={(e) => this.nextStepButtonOnClick(e, ClickEvents.submit)}
                disabled={this.disabledState || this.formLoading}>
                Submit
              </button>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
