import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { config } from '../../../../../config';
import Api from '../../../../api/Api';
import { businessTermsConditionsSchema } from '../../schemas/business-terms-conditions-schema';

@Component({
  tag: 'justifi-business-terms-conditions-form-step',
  styleUrl: 'business-terms-conditions-form-step.scss',
})
export class BusinessTermsConditionsFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @State() acceptedTerms: any;
  @State() formController: FormController;
  @State() errors: any = {};
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

  private api: any;

  get termsConditionsEndpoint() {
    return 'entities/terms_and_conditions'
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessTermsConditionsSchema(this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = this.formController.values.getValue();
      const response = await this.api.patch(this.termsConditionsEndpoint, payload);
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.patchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: BusinessFormServerErrors.patchData });
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response, metadata: { completedStep: 'representative' } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.acceptedTerms = values.accepted
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: boolean) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
    console.log(this.formController.values.getValue());
  }

  render() {
    return (
      <Host>
        <form>
          <fieldset>
            <legend>Terms and Conditions</legend>
            <hr />
            <div class="row-gy-3">
              <div class="col-12">
                <form-control-checkbox
                  name="accepted"
                  label="I agree to the terms and conditions"
                  inputHandler={this.inputHandler}
                  error={this.errors.accepted}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }

}