import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { PHONE_MASKS } from '../../../../utils/form-input-masks';
import { CoreBusinessInfo, IBusiness, ICoreBusinessInfo } from '../../../../api/Business';
import { Api, IApiResponse } from '../../../../api';
import { businessCoreInfoSchema } from '../../schemas/business-core-info-schema';
import { config } from '../../../../../config';
import { parseCoreInfo } from '../../utils/payload-parsers';
import { flattenNestedObject } from '../../../../utils/utils';
import { BusinessFormStep, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { businessClassificationOptions } from '../../utils/business-form-options';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { numberOnlyHandler } from '../../../form/utils';

/**
 *
 * The difference between this component and business-generic-info-details
 * is that this component is meant to be a form and send data
 * and the other one  is meant to be just read only.
 *
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-core-info-form-step'
})
export class BusinessCoreInfoFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() coreInfo: ICoreBusinessInfo = {};
  
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

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.coreInfo = new CoreBusinessInfo(response.data);
      this.formController.setInitialValues({ ...this.coreInfo });
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.FETCH_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: error,
      })
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = parseCoreInfo(flattenNestedObject(this.formController.values.getValue()));
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify(payload));
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.PATCH_ERROR,
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
        errorCode: ComponentErrorCodes.PATCH_ERROR,
        message: response.error.message,
        severity: ComponentErrorSeverity.ERROR,
        data: response.error,
      })
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.coreInfo } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.formController = new FormController(businessCoreInfoSchema(this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    if (this.businessId && this.authToken) {
      this.fetchData();
    }
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.coreInfo = { ...values }
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const coreInfoDefaultValue = this.formController.getInitialValues();

    return (
      <Host exportparts='label,input,input-invalid'>
        <form>
          <fieldset>
            <legend>General Info</legend>
            <hr />
            <div class='row gy-3'>
              <div class='col-12'>
                <form-control-text
                  name='legal_name'
                  label='Legal Name'
                  defaultValue={coreInfoDefaultValue.legal_name}
                  errorText={this.errors.legal_name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12'>
                <form-control-text
                  name='doing_business_as'
                  label='Doing Business As (DBA)'
                  defaultValue={coreInfoDefaultValue.doing_business_as}
                  errorText={this.errors.doing_business_as}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-8'>
                <form-control-select
                  name='classification'
                  label='Business Classification'
                  options={businessClassificationOptions}
                  defaultValue={coreInfoDefaultValue.classification}
                  errorText={this.errors.classification}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-4'>
                <form-control-date
                  name='date_of_incorporation'
                  label='Date of Incorporation'
                  defaultValue={coreInfoDefaultValue.date_of_incorporation}
                  errorText={this.errors.date_of_incorporation}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-text
                  name='industry'
                  label='Industry'
                  defaultValue={coreInfoDefaultValue.industry}
                  errorText={this.errors.industry}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-text
                  name='tax_id'
                  label='Tax ID (EIN or SSN)'
                  defaultValue={coreInfoDefaultValue.tax_id}
                  errorText={this.errors.tax_id}
                  inputHandler={this.inputHandler}
                  keyDownHandler={numberOnlyHandler}
                  maxLength={9}
                />
              </div>
              <div class='col-12'>
                <form-control-text
                  name='website_url'
                  label='Website URL'
                  defaultValue={coreInfoDefaultValue.website_url}
                  errorText={this.errors.website_url}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-text
                  name='email'
                  label='Email Address'
                  defaultValue={coreInfoDefaultValue.email}
                  errorText={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-number-masked
                  name='phone'
                  label='Phone Number'
                  defaultValue={coreInfoDefaultValue.phone}
                  errorText={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
