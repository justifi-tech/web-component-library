import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../ui-components/form/form';
import { businessFormSchema } from '../schemas/business-form-schema';
import { Api, IApiResponse } from '../../../api';
import { config } from '../../../../config';
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormServerErrors, BusinessFormSubmitEvent } from '../utils/business-form-types';
import { Business, IBusiness } from '../../../api/Business';
import JustifiAnalytics from '../../../api/Analytics';
import { StyledHost } from '../../../ui-components';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-form',
  styleUrl: 'business-form.css',
  shadow: true
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
  @Event({ eventName: 'click-event' }) clickEventNew: EventEmitter<BusinessFormClickEvent>;
  @Event({ eventName: 'clickEvent' }) clickEventOld: EventEmitter<BusinessFormClickEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(businessFormSchema);
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    this.fetchData();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

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

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private formController: FormController;
  private api: any;

  instantiateBusiness = (data: IBusiness) => {
    const business = new Business(data);
    this.formController.setInitialValues({ ...business });
  }

  private sendData = async () => {
    this.isLoading = true;
    try {
      const values = this.formController.values.getValue();
      const initialValues = this.formController.getInitialValues();
      const payload = new Business({ ...initialValues, ...values }).payload;
      const response = await this.api.patch(this.businessEndpoint, payload);
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
      <StyledHost exportparts="label,input,input-invalid">
        <form onSubmit={this.validateAndSubmit}>
          <div class="row gap-3">
            <h1>{this.title}</h1>
            <form-alert text={this.errorMessage} hideAlert={this.hideErrors} />
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
                onClick={() => this.fireClickEvents({ name: BusinessFormClickActions.submit })}>
                {this.isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </StyledHost>
    );
  }
}
