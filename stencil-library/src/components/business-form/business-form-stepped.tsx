import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../form/form';
import businessFormSchema from './business-form-schema';
import { Api } from '../../api';
import { parseForPatching } from './helpers';


const componentStepMapping = {
  0: (formController) => <justifi-business-generic-info formController={formController} />,
  1: (formController) => <justifi-legal-address-form formController={formController} />,
  2: (formController) => <justifi-additional-questions formController={formController} />,
  3: (formController) => <justifi-business-representative formController={formController} />,
  4: (formController) => <justifi-business-owners formController={formController} />
};


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
  @Prop() businessId?: string;
  @State() isLoading: boolean = false;
  @State() currentStep: number = 0;
  @State() totalSteps: number = 4;

  private formController: FormController;
  private api: any;

  constructor() {
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillLoad() {
    if (!this.authToken) {
      console.warn(
        'Warning: Missing auth-token. The form will not be functional without it.',
      );
    }

    this.formController = new FormController(businessFormSchema);
    this.api = Api(this.authToken, process.env.ENTITIES_ENDPOINT);
    this.totalSteps = Object.keys(componentStepMapping).length - 1;

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

  private async sendData() {
    this.isLoading = true;
    try {
      const data = this.formController.values.getValue();
      // Conditionally making either POST or PATCH request
      if (this.businessId) {
        const payload = parseForPatching(data);
        const response = await this.api.patch(
          `entities/business/${this.businessId}`,
          JSON.stringify(payload),
        );
        console.log('Server response from PATCH:', response);
      } else {
        const response = await this.api.post(
          'entities/business',
          JSON.stringify(data),
        );
        console.log('Server response from POST:', response);
      }
    } catch (error) {
      console.error('Error sending data:', error);
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
      console.error('Error fetching data:', error);
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
    this.sendData();
    this.currentStep--;
  }

  showNextStepButton() {
    return this.currentStep < this.totalSteps;
  }

  nextStepButtonOnClick() {
    this.sendData();
    this.currentStep++;
  }

  showSubmitButton() {
    return this.currentStep === this.totalSteps;
  }

  get percentageComplete(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <h1>Business Information</h1>

        <div class="progress my-4"
          role="progressbar"
          aria-label="Basic example"
          aria-valuenow={this.percentageComplete}
          aria-valuemin="0"
          aria-valuemax="100">
          <div class="progress-bar" style={{ width: `${this.percentageComplete}%` }}></div>
        </div>

        <form onSubmit={this.validateAndSubmit}>
          <div class="my-4">
            {componentStepMapping[this.currentStep](this.formController)}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              Step {this.currentStep + 1} of {this.totalSteps + 1}

              {this.isLoading && (
                <div class="spinner-border ms-2" style={{ width: '1.5rem', height: '1.5rem' }} role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              )}
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
                  disabled={this.isLoading}>
                  Next
                </button>
              )}
              {this.showSubmitButton() && (
                <button
                  type="submit"
                  class="btn btn-primary"
                  onClick={() => this.nextStepButtonOnClick()}
                  disabled={this.isLoading}>
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
