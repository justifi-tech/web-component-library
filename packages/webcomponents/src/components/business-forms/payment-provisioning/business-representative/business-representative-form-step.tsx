import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { PHONE_MASKS, SSN_MASK } from '../../../../utils/form-input-masks';
import Api, { IApiResponse } from '../../../../api/Api';
import { IBusiness } from '../../../../api/Business';
import { parseIdentityInfo } from '../../utils/payload-parsers';
import { identitySchema } from '../../schemas/business-identity-schema';
import { config } from '../../../../../config';
import { BusinessFormStep, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { Representative } from '../../../../api/Identity';
import { deconstructDate } from '../../utils/helpers';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';


@Component({
  tag: 'justifi-business-representative-form-step'
})
export class BusinessRepresentativeFormStep {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: Representative = {};
  
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

  get identificationNumberLabel() {
    return this.representative.ssn_last4 ? 'Update SSN (optional)' : 'SSN';
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.representative = new Representative(response.data.representative || {});
      this.formController.setInitialValues({ ...this.representative });
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
      const payload = parseIdentityInfo(this.formController.values.getValue());
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify({ representative: payload }));
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
    this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.representative } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    this.formController = new FormController(identitySchema('representative', this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    if (this.businessId && this.authToken) {
      this.fetchData();
    }
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    this.formController.values.subscribe(
      values => (this.representative = { ...values }),
    );
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  onAddressFormUpdate = (values: any): void => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      address: {
        ...this.formController.values.getValue().address,
        ...values,
      }
    });
  }

  onDateOfBirthUpdate = (event): void => {
    if (event.detail === '') {
      this.formController.setValues({
        ...this.formController.values.getValue(),
        dob_day: null,
        dob_month: null,
        dob_year: null,
      });
    } else {
      const dob_values = deconstructDate(event.detail);
      this.formController.setValues({
        ...this.formController.values.getValue(),
        dob_day: dob_values.dob_day,
        dob_month: dob_values.dob_month,
        dob_year: dob_values.dob_year,
      });
    }
  }

  render() {
    const representativeDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Representative</legend>
            <hr />
            <div class="row gy-3">
              <div class="col-12 col-md-8">
                <form-control-text
                  name="name"
                  label="Full Name"
                  defaultValue={representativeDefaultValue?.name}
                  errorText={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-text
                  name="title"
                  label="Title"
                  defaultValue={representativeDefaultValue?.title}
                  errorText={this.errors.title}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="email"
                  label="Email Address"
                  defaultValue={representativeDefaultValue?.email}
                  errorText={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-number-masked
                  name="phone"
                  label="Phone Number"
                  defaultValue={representativeDefaultValue?.phone}
                  errorText={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-date
                  name="dob_full"
                  label="Birth Date"
                  defaultValue={representativeDefaultValue?.dob_full}
                  errorText={this.errors.dob_full}
                  inputHandler={this.inputHandler}
                  onFormControlInput={this.onDateOfBirthUpdate}
                />
              </div>
              <div class="col-12 col-md-8">
                <form-control-number-masked
                  name="identification_number"
                  label={this.identificationNumberLabel}
                  defaultValue={representativeDefaultValue?.identification_number}
                  errorText={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                  mask={SSN_MASK}
                />
              </div>
              <div class="col-12">
                <justifi-identity-address-form
                  errors={this.errors.address}
                  defaultValues={representativeDefaultValue?.address}
                  handleFormUpdate={this.onAddressFormUpdate}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
