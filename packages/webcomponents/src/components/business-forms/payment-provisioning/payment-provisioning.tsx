import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { LoadingSpinner } from '../../form/utils';
import { BusinessFormClickActions, BusinessFormClickEvent } from '../utils/business-form-types';
import JustifiAnalytics from '../../../api/Analytics';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */

@Component({
  tag: 'justifi-payment-provisioning',
  styleUrl: 'payment-provisioning.scss',
})
export class PaymentProvisioning {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() testMode: boolean = false;
  @Prop() hideErrors?: boolean = false;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() formTitle?: string = 'Business Information';
  @Prop() removeTitle?: boolean = false;
  @State() formLoading: boolean = false;
  @State() errorMessage: string = '';
  @State() currentStep: number = 0;
  @State() businessPaymentVolume: string;
  @Event({eventName: 'click-event'}) clickEvent: EventEmitter<BusinessFormClickEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.refs = [this.coreInfoRef, this.legalAddressRef, this.additionalQuestionsRef, this.representativeRef, this.ownersRef, this.bankAccountRef, this.documentUploadRef, this.termsRef];
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  get title() {
    return this.removeTitle ? '' : this.formTitle;
  }

  get totalSteps() { 
    return Object.keys(this.componentStepMapping).length - 1; 
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private coreInfoRef: any;
  private legalAddressRef: any;
  private additionalQuestionsRef: any;
  private representativeRef: any;
  private ownersRef: any;
  private bankAccountRef: any;
  private documentUploadRef: any;
  private termsRef: any;
  private refs = [];

  componentStepMapping = {
    0: () => <justifi-business-core-info-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[0] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
    />,
    1: () => <justifi-legal-address-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[1] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
    />,
    2: () => <justifi-additional-questions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[2] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
      onSubmitted={this.setBusinessPaymentVolume}
    />,
    3: () => <justifi-business-representative-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[3] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
    />,
    4: () => <justifi-business-owners-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[4] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
    />,
    5: () => <justifi-business-bank-account-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[5] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
    />,
    6: () => <justifi-business-document-upload-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[6] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
      paymentVolume={this.businessPaymentVolume}
    />,
    7: () => <justifi-business-terms-conditions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[7] = el}
      onFormLoading={this.handleFormLoading}
      onServerError={this.handleServerErrors}
      allowOptionalFields={this.allowOptionalFields}
    />,
  };

  handleFormLoading = (e: CustomEvent) => {
    this.formLoading = e.detail;
  }

  handleServerErrors = (e: CustomEvent) => {
    this.errorMessage = e.detail.message;
  }

  setBusinessPaymentVolume = (e: CustomEvent) => {
    let business = e.detail.data.data;
    this.businessPaymentVolume = business?.additional_questions.business_payment_volume;
  }

  showPreviousStepButton() {
    return this.currentStep > 0;
  }

  showNextStepButton() {
    return this.currentStep < this.totalSteps;
  }

  incrementSteps = () => {
    if (this.currentStep < this.totalSteps) {
      return this.currentStep++;
    }
  }
  decrementSteps = () => { return this.currentStep--; }

  previousStepButtonOnClick() {
    this.clickEvent.emit({ name: BusinessFormClickActions.previousStep })
    this.decrementSteps();
  }

  nextStepButtonOnClick(e: any, clickEventName) {
    e.preventDefault();
    this.clickEvent.emit({ name: clickEventName })

    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit({ onSuccess: this.incrementSteps });
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
        <div class="row gap-3">
          <h1>{this.title}</h1>
          <form-alert text={this.errorMessage} hideAlert={this.hideErrors} />
          <div class="col-12 mb-4">
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
                  class={`btn btn-primary jfi-submit-button${this.formLoading ? ' jfi-submit-button-loading' : ''}`}
                  onClick={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.nextStep)}
                  disabled={this.formLoading}>
                  {this.formLoading ? LoadingSpinner() : 'Next'}
                </button>
              )}
              {this.showSubmitButton() && (
                <button
                  type="submit"
                  class={`btn btn-primary jfi-submit-button${this.formLoading ? ' jfi-submit-button-loading' : ''}`}
                  onClick={(e) => this.nextStepButtonOnClick(e, BusinessFormClickActions.submit)}
                  disabled={this.formLoading}>
                  {this.formLoading ? LoadingSpinner() : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
