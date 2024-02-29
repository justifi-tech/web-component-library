import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../form/form';
import businessFormSchema from './business-form-schema';
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
  @State() isLoading: boolean = false;
  @State() currentStep: number = 0;
  @State() totalSteps: number = 4;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';
  @Event() clickEvent: EventEmitter<{ data?: any, name: string }>;
  @Event() submitted: EventEmitter<{ data: any }>;


  private formController: FormController;

  get disabledState() {
    return this.isLoading;
  }

  get showErrors() {
    return this.serverError && !this.hideErrors;
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private additionalQuestionsRef: any;
  private coreInfoRef: any;
  private refs = [];

  componentStepMapping = {
    0: () => <justifi-business-core-info-form-step ref={(el) => this.refs[0] = el} authToken={this.authToken} businessId={this.businessId} />,
    // 1: (formController) => <justifi-legal-address-form-step formController={formController} />,
    1: () => <justifi-additional-questions-form-step ref={(el) => this.refs[1] = el} authToken={this.authToken} businessId={this.businessId} />,
    // 3: (formController) => <justifi-business-representative-form-step formController={formController} />
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessFormSchema);
    this.refs = [this.coreInfoRef, this.additionalQuestionsRef];
    this.totalSteps = Object.keys(this.componentStepMapping).length - 1;
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError = true;
      this.errorMessage = response.error.message;
    } else {
      this.serverError = false;
      this.businessId = response.data.id;
      this.formController.setInitialValues(response.data);
      onSuccess();
    }
  }

  showPreviousStepButton() {
    return this.currentStep > 0;
  }

  previousStepButtonOnClick() {
    this.clickEvent.emit({ name: ClickEvents.previousStep })
    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit();
    this.currentStep--;
  }

  showNextStepButton() {
    return this.currentStep < this.totalSteps;
  }

  nextStepButtonOnClick(e: any, clickEventName) {
    e.preventDefault();
    this.clickEvent.emit({ name: clickEventName })

    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit();
    this.currentStep++;
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
        <form>
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
                  disabled={this.isLoading}>
                  Previous
                </button>
              )}
              {this.showNextStepButton() && (
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={(e) => this.nextStepButtonOnClick(e, ClickEvents.nextStep)}
                  disabled={this.disabledState}>
                  Next
                </button>
              )}
              {this.showSubmitButton() && (
                <button
                  type="submit"
                  class="btn btn-primary"
                  onClick={(e) => this.nextStepButtonOnClick(e, ClickEvents.submit)}
                  disabled={this.disabledState}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </form>
      </Host>
    );
  }
}
