import { Component, h, Prop, State, Event, EventEmitter, Host } from "@stencil/core";
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormSubmitEvent } from "../utils/business-form-types";
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from "../../../api/ComponentError";
import { checkProvisioningStatus } from "../utils/helpers";

@Component({
  tag: "justifi-payment-provisioning-core",
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
    this.getBusiness && this.fetchBusiness();

    this.refs = [this.coreInfoRef, this.legalAddressRef, this.additionalQuestionsRef, this.representativeRef, this.ownersRef, this.bankAccountRef, this.documentUploadRef, this.termsRef];
  }

  fetchBusiness = () => {
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

  get totalSteps() {
    return Object.keys(this.componentStepMapping).length - 1;
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get formDisabled() {
    return this.formLoading || this.businessProvisioned;
  }

  get currentStepComponent() {
    return this.componentStepMapping[this.currentStep]();
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

  componentStepMapping = {
    0: () => <justifi-business-core-info-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[0] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    1: () => <justifi-legal-address-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[1] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    2: () => <justifi-additional-questions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[2] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    3: () => <justifi-business-representative-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[3] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    4: () => <justifi-business-owners-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[4] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    5: () => <justifi-business-bank-account-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[5] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    6: () => <justifi-business-document-upload-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[6] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
    />,
    7: () => <justifi-business-terms-conditions-form-step
      businessId={this.businessId}
      authToken={this.authToken}
      ref={(el) => this.refs[7] = el}
      onFormLoading={this.handleFormLoading}
      allowOptionalFields={this.allowOptionalFields}
      onSubmitted={() => this.postProvisioningData()}
    />,
  };
  
  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="row gap-3">
          <h1>{this.formTitle}</h1>
          <div class="col-12 mb-4">
            {this.currentStepComponent}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              Step {this.currentStep + 1} of {this.totalSteps + 1}
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
      </Host>
    )
  }
}
