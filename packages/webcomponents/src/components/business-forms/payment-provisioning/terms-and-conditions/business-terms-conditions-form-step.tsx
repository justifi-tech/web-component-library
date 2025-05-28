import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../../ui-components/form/form';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { businessTermsConditionsSchema } from '../../schemas/business-terms-conditions-schema';
import { Api, IApiResponse } from '../../../../api';
import { IBusiness } from '../../../../api/Business';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { heading2 } from '../../../../styles/parts';
import { BusinessFormStep } from '../../utils';

@Component({
  tag: 'justifi-business-terms-conditions-form-step'
})
export class BusinessTermsConditionsFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() acceptedTermsBefore: boolean;
  @State() acceptedTerms: boolean;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;

  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading events
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ bubbles: true }) formCompleted: EventEmitter<any>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get termsConditionsEndpoint() {
    return 'entities/terms_and_conditions'
  }

  get formHelperText() {
    return this.acceptedTermsBefore ? 'You have already accepted the terms and conditions.' : null
  }

  get termsPayload() {
    return {
      business_id: this.businessId,
      accepted: this.formController.values.getValue().accepted,
      user_agent: window.navigator.userAgent
    }
  }

  async componentWillLoad() {
    this.api = Api();
    this.formController = new FormController(businessTermsConditionsSchema(this.allowOptionalFields));
    if (this.businessId && this.authToken) {
      this.fetchData();
    }
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get({ endpoint: this.businessEndpoint,  authToken: this.authToken });
      this.acceptedTermsBefore = response.data.terms_conditions_accepted;
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.FETCH_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = this.termsPayload;
      const response = await this.api.post({ endpoint: this.termsConditionsEndpoint, body: payload, authToken: this.authToken });
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.POST_ERROR,
        message: response.error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: response.error,
      })
    } else {
      onSuccess();
    }
    this.stepCompleteEvent.emit({ response: response, formStep: BusinessFormStep.termsAndConditions });
    this.formCompleted.emit();
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    if (this.acceptedTermsBefore) {
      this.stepCompleteEvent.emit({ response: null, formStep: BusinessFormStep.termsAndConditions, metadata: 'no data submitted' });
      this.formCompleted.emit();
      onSuccess();
    } else {
      this.formController.validateAndSubmit(() => this.sendData(onSuccess));
    }
  };

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: boolean) => {
    this.acceptedTerms = value;
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  get merchantAgreementLink() {
    return (
      <a
        href="https://justifi.tech/merchant-agreement/"
        target="_blank"
        rel="noopener noreferrer"
      >
        merchant agreement
      </a>
    )
  }


  render() {
    return (
      <form>
        <fieldset>
          <legend part={heading2}>Terms and Conditions</legend>
          <hr />
          <div>
            <p>
              Please read and accept the {this.merchantAgreementLink} to submit your provisioning request.
            </p>
          </div>
          <br />
          <div class="row-gy-3">
            <div class="col-12">
              <form-control-checkbox
                name="accepted"
                label="I agree to the terms and conditions"
                inputHandler={this.inputHandler}
                errorText={this.errors.accepted}
                disabled={this.acceptedTermsBefore}
                helpText={this.formHelperText}
                checked={this.acceptedTerms}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
