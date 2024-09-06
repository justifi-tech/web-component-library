import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormSubmitEvent } from '../utils/business-form-types';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';
import { checkProvisioningStatus } from '../utils/helpers';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-payment-provisioning-core',
  shadow: true
})
export class PaymentProvisioningCore {
  @State() formLoading: boolean = false;
  @State() businessProvisioned: boolean = false;
  @State() currentStep: number = 0;
  @State() errorMessage: string;

  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() formTitle: string
  @Prop() getBusiness: Function;
  @Prop() postProvisioning: Function;

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<BusinessFormClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;
  @Event() submitted: EventEmitter<BusinessFormSubmitEvent>;

  componentWillLoad() {
    this.getBusiness && this.setBusinessProvisioned();

    this.refs = [this.coreInfoRef, this.legalAddressRef, this.additionalQuestionsRef, this.representativeRef, this.ownersRef, this.bankAccountRef, this.documentUploadRef, this.termsRef];
  }

  setBusinessProvisioned = () => {
    this.getBusiness({
      onSuccess: (response) => {
        this.businessProvisioned = checkProvisioningStatus(response.data);
        if (this.businessProvisioned) {
          this.errorEvent.emit({
            message: 'A request to provision payments for this business has already been submitted.',
            errorCode: ComponentErrorCodes.PROVISIONING_REQUESTED,
            severity: ComponentErrorSeverity.INFO,
          });
        }
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      }
    });
  }

  postProvisioningData = () => {
    this.postProvisioning({
      onSuccess: (response) => {
        this.submitted.emit({ data: { response } });
      },
      onError: ({ error, code, severity }) => {
        this.submitted.emit({ data: { error } });
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      }
    });
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

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get formDisabled() {
    return this.formLoading || this.businessProvisioned;
  }

  get totalSteps() {
    return this.refs.length - 1;
  }

  get stepCounter() {
    return `${this.currentStep + 1} of ${this.totalSteps + 1}`;
  }

  handleFormLoading = (e: CustomEvent) => {
    this.formLoading = e.detail;
  }

  incrementSteps = () => {
    if (this.currentStep < this.totalSteps) {
      return this.currentStep++;
    }
  }

  decrementSteps = () => { return this.currentStep--; }

  previousStepButtonOnClick = () => {
    this.clickEvent.emit({ name: BusinessFormClickActions.previousStep })
    this.decrementSteps();
  }

  nextStepButtonOnClick = (e: any, clickEventName) => {
    e.preventDefault();
    this.clickEvent.emit({ name: clickEventName })

    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit({ onSuccess: this.incrementSteps });
  }

  render() {
    return (
      <StyledHost exportparts='label,input,input-invalid'>
        <div class='row gap-3'>
          <h1>{this.formTitle}</h1>
          <justifi-payment-provisioning-form-steps
            businessId={this.businessId}
            authToken={this.authToken}
            refs={this.refs}
            currentStep={this.currentStep}
            allowOptionalFields={this.allowOptionalFields}
            handleFormLoading={this.handleFormLoading}
            onFormCompleted={() => this.postProvisioningData()}
          />
          <div class='d-flex justify-content-between align-items-center'>
            <div class='d-flex align-items-center'>
              {this.stepCounter}
            </div>
            <justifi-payment-provisioning-form-buttons
              currentStep={this.currentStep}
              totalSteps={this.totalSteps}
              formLoading={this.formLoading}
              formDisabled={this.formDisabled}
              previousStepButtonOnClick={this.previousStepButtonOnClick}
              nextStepButtonOnClick={this.nextStepButtonOnClick}
            />
          </div>
        </div>
      </StyledHost>
    )
  }
}
