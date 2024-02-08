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
  tag: 'justifi-business-form',
  styleUrl: 'business-form.scss',
})
export class BusinessForm {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() hideErrors?: boolean;
  @State() isLoading: boolean = false;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';

  get submitDisabled() {
    return !this.authToken || this.isLoading || this.serverError;
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

  componentWillLoad() {
    if (!this.authToken) {
      console.warn(
        'Warning: Missing auth-token. The form will not be functional without it.',
      );
    }
    if (!this.businessId) {
      console.warn(
        'Warning: Missing business-id. The form requires an existing business-id to function.'
      )
    }

    console.log('*** business-form this.businessId as boolean', !!this.businessId)

    this.formController = new FormController(businessFormSchema);

    this.api = Api(this.authToken, config.proxyApiOrigin);

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

      const payload = parseForPatching(data);
      const response = await this.api.patch(
        `entities/business/${this.businessId}`,
        JSON.stringify(payload),
      );
      console.log('Server response from PATCH:', response);
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

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={event => this.validateAndSubmit(event)}>
          <div class="row gap-3">
            <div class="col-12 mb-4">
              <h1>Business Information</h1>
            </div>
            {this.showErrors && FormAlert(this.errorMessage)}
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
              <justifi-business-owners formController={this.formController} />
            </div>
            <div class="col-12 d-flex flex-row-reverse">
              <button
                type="submit"
                class="btn btn-primary jfi-submit-button"
                disabled={this.submitDisabled}
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
