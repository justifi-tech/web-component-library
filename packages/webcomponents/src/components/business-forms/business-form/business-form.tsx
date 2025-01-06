import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../ui-components/form/form';
import { businessFormSchema } from '../schemas/business-form-schema';
import { Api, IApiResponse } from '../../../api';
import { config } from '../../../../config';
import { Business, BusinessFormServerErrors, IBusiness } from '../../../api/Business';
import JustifiAnalytics from '../../../api/Analytics';
import { Button, Header1, StyledHost } from '../../../ui-components';
import { checkPkgVersion } from '../../../utils/check-pkg-version';
import { ComponentClickEvent, ComponentSubmitEvent } from '../../../api/ComponentEvents';
import { BusinessFormClickActions } from '../utils';

@Component({
  tag: 'justifi-business-form',
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

  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;
  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<ComponentClickEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
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
    this.submitEvent.emit({ response: response });
    this.instantiateBusiness(response.data);
  }

  render() {
    return (
      <StyledHost>
        <form onSubmit={this.validateAndSubmit}>
          <div class="row gap-3">
            <Header1 text={this.title} />
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
              <Button
                type="submit"
                disabled={this.disabledState}
                variant='primary'
                onClick={() => this.clickEvent.emit({ name: BusinessFormClickActions.submit })}
                isLoading={this.isLoading}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </StyledHost>
    );
  }
}
