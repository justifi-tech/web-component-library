import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormStep, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { config } from '../../../../../config';
import { businessTermsConditionsSchema } from '../../schemas/business-terms-conditions-schema';
import { Api, IApiResponse } from '../../../../api';
import { IBusiness } from '../../../../api/Business';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';

@Component({
  tag: 'justifi-business-terms-conditions-form-step'
})
export class BusinessTermsConditionsFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() acceptedTermsBefore: boolean;
  
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get termsConditionsEndpoint() {
    return 'entities/terms_and_conditions'
  }

  get provisioningEndpoint() {
    return 'entities/provisioning'
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

  get provsioningPayload() {
    return {
      new_account_name: this.legal_name,
      business_id: this.businessId,
      product_category: 'payment',
    }
  }

  async componentWillLoad() {
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    this.formController = new FormController(businessTermsConditionsSchema(this.allowOptionalFields));
    if (this.businessId && this.authToken) {
      this.fetchData();
    }
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.acceptedTermsBefore = response.data.terms_conditions_accepted;
      this.legal_name = response.data.legal_name;
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.FETCH_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
    } finally {
      console.log('this.ProvisioningPayload', this.provsioningPayload);
      this.formLoading.emit(false);
    }
  }

  // private postTermsData = async (onSuccess?: () => void) => {
  //   this.formLoading.emit(true);
  //   try {
  //     const payload = JSON.stringify(this.termsPayload);
  //     const response = await this.api.post(this.termsConditionsEndpoint, payload);
  //     this.handleResponse(response, onSuccess);
  //   } catch (error) {
  //     this.serverError.emit({ data: error, message: BusinessFormServerErrors.patchData });
  //   } finally {
  //     this.formLoading.emit(false);
  //   }
  // }

  private postProvisioningData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = JSON.stringify(this.provsioningPayload);
      const response = await this.api.post(this.provisioningEndpoint, payload);
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
    this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.termsAndConditions } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    // this.acceptedTermsBefore ? onSuccess() :
    // this.formController.validateAndSubmit(() => this.postTermsData(onSuccess));
    this.postProvisioningData(onSuccess);
  };

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: boolean) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    return (
      <Host>
        <form>
          <fieldset>
            <legend>Terms and Conditions</legend>
            <hr />
            <justifi-business-terms-conditions-text />
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
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
