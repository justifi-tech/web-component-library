import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../form/form';
import { businessFormSchema } from '../schemas/business-form-schema';
import { Api, IApiResponse } from '../../../api';
import { parseBusiness } from '../utils/payload-parsers';
import { config } from '../../../../config';
import { FormAlert } from '../../form/utils';
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormServerErrors, BusinessFormSubmitEvent } from '../utils/business-form-types';
import { Business, IBusiness } from '../../../api/Business';

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
  @Prop() formTitle?: string = 'Business Information';
  @Prop() removeTitle?: boolean = false;
  @State() isLoading: boolean = false;
  @State() errorMessage: BusinessFormServerErrors;
  @Event() submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({eventName: 'click-event'}) clickEventNew: EventEmitter<BusinessFormClickEvent>;
  @Event({eventName: 'clickEvent'}) clickEventOld: EventEmitter<BusinessFormClickEvent>;

  fireClickEvents(event: BusinessFormClickEvent) {
    console.warn('`clickEvent` is deprecated and will be removed in the next major release. Please use `click-event` instead.');
    this.clickEventNew.emit(event);
    this.clickEventOld.emit(event);
  }

  get title() {
    return this.removeTitle ? '' : this.formTitle;
  }

  get disabledState() {
    return this.isLoading;
  }

  get showErrors() {
    return this.errorMessage && !this.hideErrors;
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private formController: FormController;
  private api: any;

  instantiateBusiness = (data: IBusiness) => {
    const business = new Business(data);
    this.formController.setInitialValues({ ...business });
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

  private sendData = async () => {
    this.isLoading = true;
    try {
      const values = this.formController.values.getValue();
      const initialValues = this.formController.getInitialValues();
      const payload = parseBusiness(values, initialValues);
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify(payload));
      this.handleReponse(response);
    } catch (error) {
      this.errorMessage = BusinessFormServerErrors.patchData;
    } finally {
      this.isLoading = false;
    }
  }

  private fetchData = async () => {
    this.isLoading = true;
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.instantiateBusiness(response.data);
    } catch (error) {
      this.errorMessage = BusinessFormServerErrors.fetchData;
    } finally {
      this.isLoading = false;
    }
  }

  private validateAndSubmit = (event: any) => {
    event.preventDefault();
    this.formController.validateAndSubmit(this.sendData);
  }

  handleReponse(response) {
    if (response.error) {
      this.errorMessage = BusinessFormServerErrors.patchData;
    } 
    this.submitted.emit({ data: response });
    this.instantiateBusiness(response.data);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={this.validateAndSubmit}>
          <div class="row gap-3">
            <div class="col-12 mb-4">
              <h1>{this.title}</h1>
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
            <div class="col-12 d-flex flex-row-reverse">
              <button
                type="submit"
                class="btn btn-primary jfi-submit-button"
                disabled={this.disabledState}
                onClick={() => this.fireClickEvents({ name: BusinessFormClickActions.submit})}
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
