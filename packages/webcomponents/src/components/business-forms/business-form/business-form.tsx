import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../form/form';
import { Api, IApiResponse } from '../../../api';
import { config } from '../../../../config';
import { FormAlert } from '../../form/utils';
import { Business, IBusiness } from '../../../api/Business';
import { businessFormSchema } from '../schemas/business-form-schema';
import { parseForPatching } from '../utils/payload-parsers';
import { BusinessFormClickEvents } from '../utils/business-form-types';

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
  @Prop() hideErrors?: boolean = false;
  @State() isLoading: boolean = false;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';
  @Event() clickEvent: EventEmitter<{ data?: any, name: string }>;
  @Event() submitted: EventEmitter<{ data: any }>;

  get disabledState() {
    return this.isLoading;
  }

  get showErrors() {
    return this.serverError && !this.hideErrors;
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private formController: FormController;
  private api: any;

  constructor() {
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.validateAndSubmit = this.validateAndSubmit.bind(this);
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessFormSchema);
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  private async sendData() {
    this.isLoading = true;
    try {
      const values = this.formController.values.getValue();
      const initialValues = this.formController.getInitialValues();
      const payload = parseForPatching(values, initialValues);
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify(payload));
      this.submitted.emit({data: response});
    } catch (error) {
      this.serverError = true;
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchData() {
    this.isLoading = true;
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      const business = new Business(response.data);
      this.formController.setInitialValues(business);
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
        <form onSubmit={this.validateAndSubmit}>
          <div class="row gap-3">
            <div class="col-12 mb-4">
              <h1>Business Information</h1>
            </div>
            {this.showErrors && FormAlert(this.errorMessage)}
            <div class="col-12 mb-4">
              <justifi-business-core-info formController={this.formController} />
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
            {/* <div class="col-12 mb-4">
              <justifi-business-owners formController={this.formController} />
            </div> */}
            <div class="col-12 d-flex flex-row-reverse">
              <button
                type="submit"
                class="btn btn-primary jfi-submit-button"
                disabled={this.disabledState}
                onClick={() => this.clickEvent.emit({ name: BusinessFormClickEvents.submit})}
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
