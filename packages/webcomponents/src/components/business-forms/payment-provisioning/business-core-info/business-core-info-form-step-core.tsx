import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { businessCoreInfoSchema } from '../../schemas/business-core-info-schema';
import { FormController } from '../../../form/form';
import { CoreBusinessInfo, ICoreBusinessInfo } from '../../../../api/Business';
import { BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { ComponentError } from '../../../../api/ComponentError';
import { businessClassificationOptions } from '../../utils/business-form-options';
import { PHONE_MASKS } from '../../../../utils/form-input-masks';
import { parseCoreInfo } from '../../utils/payload-parsers';
import { flattenNestedObject } from '../../../../utils/utils';
import { numberOnlyHandler } from '../../../form/utils';

@Component({
  tag: 'justifi-business-core-info-form-step-core',
})
export class BusinessCoreInfoFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() coreInfo: ICoreBusinessInfo = {};

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ bubbles: true }) formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  get patchPayload() {
    let formValues = parseCoreInfo(flattenNestedObject(this.formController.values.getValue()));
    return JSON.stringify(formValues);
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(businessCoreInfoSchema(this.allowOptionalFields));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.getBusiness({
      onSuccess: (response) => {
        this.coreInfo = new CoreBusinessInfo(response.data);
        this.formController.setInitialValues({ ...this.coreInfo });
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => this.formLoading.emit(false)
    });
  }

  private sendData = (onSuccess: () => void) => {
    let submittedData;
    this.formLoading.emit(true);
    this.patchBusiness({
      payload: this.patchPayload,
      onSuccess: (response) => {
        submittedData = response;
        onSuccess();
      },
      onError: ({ error, code, severity }) => {
        submittedData = error;
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.submitted.emit({ data: { submittedData } });
        this.formLoading.emit(false)
      }
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
