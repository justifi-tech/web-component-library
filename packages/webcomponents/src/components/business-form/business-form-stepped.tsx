import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../form/form';
import businessFormSchema from './business-form-schema';
import { Api } from '../../api';
import { parseForPatching } from './helpers';
import { config } from '../../../config';
import { FormAlert } from '../form/utils';

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
  @Prop() accountId: string;
  @Prop() businessId: string;
  @Prop() testMode: boolean = false;
  @Prop() hideErrors?: boolean = false;
  @State() isLoading: boolean = false;
  @State() currentStep: number = 0;
  @State() totalSteps: number = 4;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';

  get disabledState() {
    return this.isLoading;
  }

  get showErrors() {
    return this.serverError && !this.hideErrors;
  }

  private formController: FormController;
  private api: any;

  constructor() {
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentStepMapping = {
    0: (formController) => <justifi-business-generic-info formController={formController} />,
    1: (formController) => <justifi-legal-address-form formController={formController} />,
    2: (formController) => <justifi-additional-questions formController={formController} />,
    3: (formController) => <justifi-business-representative formController={formController} />
  };

  componentWillLoad() {
    if (!this.authToken) {
      console.error(
        'Warning: Missing auth-token. The form will not be functional without it.',
      );
    }
    if (!this.businessId) {
      console.error(
        'Warning: Missing business-id. The form requires an existing business-id to function.'
      )
    }

    this.formController = new FormController(businessFormSchema);
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.totalSteps = Object.keys(this.componentStepMapping).length - 1;

    if (this.businessId) {
      this.fetchData(this.businessId);
    } else {
      this.formController.setInitialValues({
        legal_address: {
          country: 'US',
        },
      });
    }
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

  private async sendData(onSuccess?: () => void) {
    // Stopgap solution to prevent sending data in storybook examples.
    if (this.testMode) {
      onSuccess();
      return;
    }

    this.isLoading = true;

    try {
      const values = this.formController.values.getValue();
      const initialValues = this.formController.getInitialValues();

      const payload = parseForPatching(values, initialValues);
      const response = await this.api.patch(
        `entities/business/${this.businessId}`,
        JSON.stringify(payload),
        { account_id: this.accountId }
      );
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.serverError = true;
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchData(businessId) {
    this.isLoading = true;
    try {
      const response = await this.api.get(`entities/business/${businessId}`);
      this.formController.setInitialValues(response.data);
    } catch (error) {
      this.serverError = true;
      this.errorMessage = `Error fetching data: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  private validateAndSubmit(event: any) {
    event.preventDefault();
    this.formController.validateAndSubmit(this.sendData);
  }

  showPreviousStepButton() {
    return this.currentStep > 0;
  }

  previousStepButtonOnClick() {
    this.sendData(() => this.currentStep--);
  }

  showNextStepButton() {
    return this.currentStep < this.totalSteps;
  }

  nextStepButtonOnClick() {
    this.sendData(() => this.currentStep++);
  }

  showSubmitButton() {
    return this.currentStep === this.totalSteps;
  }

  currentStepComponent() {
    return this.componentStepMapping[this.currentStep](this.formController);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>
        {this.showErrors && FormAlert(this.errorMessage)}
        <form onSubmit={this.validateAndSubmit}>
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
                  onClick={() => this.nextStepButtonOnClick()}
                  disabled={this.disabledState}>
                  Next
                </button>
              )}
              {this.showSubmitButton() && (
                <button
                  type="submit"
                  class="btn btn-primary"
                  onClick={() => this.nextStepButtonOnClick()}
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
