import { Component, Host, h, Prop, State } from '@stencil/core';
import { FormController } from '../form/form';
import businessFormSchema from './business-form-schema';
import { Api } from '../../api';
import { parseForPatching } from './helpers';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-form',
  styleUrl: 'business-form.scss',
})
export class BusinessForm {
  @Prop() authToken: string;
  @Prop() businessId?: string;
  @State() isLoading: boolean = false;

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

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={event => this.validateAndSubmit(event)}>
          <div class="row gap-3">
            <div class="col-12 mb-4">
              <h1>Business Information</h1>
            </div>
            <div class="col-12 mb-4">
              <justifi-business-generic-info formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-legal-address-form formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-additional-questions formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-business-representative formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-business-owners isEditing={!!this.businessId} formController={this.formController} />
            </div>
            <div class="col-12 d-flex flex-row-reverse">
              <button
                type="submit"
                class="btn btn-primary jfi-submit-button"
                disabled={!this.authToken || this.isLoading}
              >
                {this.isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </Host>
    );
  }
}
