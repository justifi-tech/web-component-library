import { Component, h, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';
import { checkProvisioningStatus } from '../utils/helpers';
import { Header1, StyledHost } from '../../../ui-components';
import { text } from '../../../styles/parts';
import { ComponentClickEvent, ComponentErrorEvent, ComponentSubmitEvent } from '../../../api/ComponentEvents';
import { BusinessFormClickActions } from '../utils/event-types';
import { CountryCode } from '../../../utils/country-codes';
import { Business } from '../../../api/Business';

@Component({
  tag: 'justifi-payment-provisioning-core',
})
export class PaymentProvisioningCore {
  @State() loading: boolean = false;
  @State() businessProvisioned: boolean = false;
  @State() currentStep: number = 0;
  @State() errorMessage: string;
  @State() country: CountryCode = CountryCode.USA;

  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() formTitle: string
  @Prop() getBusiness: Function;
  @Prop() postProvisioning: Function;

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  @Listen('formCompleted')
  handleFormCompleted() {
    this.postProvisioningData();
  }

  componentWillLoad() {
    this.getBusiness && this.setBusinessProvisioned();
    this.refs = [
      this.coreInfoRef,
      this.legalAddressRef,
      this.additionalQuestionsRef,
      this.representativeRef,
      this.ownersRef,
      this.bankAccountRef,
      this.termsRef,
    ];
  }

  setBusinessProvisioned = () => {
    this.getBusiness({
      onSuccess: (response) => {
        const business = new Business(response.data);
        this.businessProvisioned = checkProvisioningStatus(business);
        this.country = business.country_of_establishment;
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
        this.submitEvent.emit({ response: response });
      },
      onError: ({ error, code, severity }) => {
        this.submitEvent.emit({ response: { error } });
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
  private termsRef: any;
  private refs = [];

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get formDisabled() {
    return this.loading || this.businessProvisioned;
  }

  get totalSteps() {
    return this.refs.length - 1;
  }

  get stepCounter() {
    return `${this.currentStep + 1} of ${this.totalSteps + 1}`;
  }

  @Listen('formLoading')
  handleFormLoading(event: CustomEvent) {
    this.loading = event.detail;
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
      <StyledHost>
        <div class='row gap-3'>
          <Header1 text={this.formTitle} />
          <justifi-payment-provisioning-form-steps
            businessId={this.businessId}
            authToken={this.authToken}
            refs={this.refs}
            currentStep={this.currentStep}
            allowOptionalFields={this.allowOptionalFields}
            country={this.country}
            handleFormLoading={this.handleFormLoading}
          />
          <div class='d-flex justify-content-between align-items-center'>
            <div class='d-flex align-items-center' part={text}>
              {this.stepCounter}
            </div>
            <justifi-payment-provisioning-form-buttons
              currentStep={this.currentStep}
              totalSteps={this.totalSteps}
              formLoading={this.loading}
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
