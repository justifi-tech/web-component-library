import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { PHONE_MASKS } from '../../../../utils/form-input-masks';
import Api, { IApiResponse } from '../../../../api/Api';
import { IBusiness } from '../../../../api/Business';
import { parseIdentityInfo } from '../../utils/payload-parsers';
import { identitySchema } from '../../schemas/business-identity-schema';
import { config } from '../../../../../config';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { Representative } from '../../../../api/Identity';
import { deconstructDate } from '../../utils/helpers';

@Component({
  tag: 'justifi-business-representative-form-step',
  styleUrl: 'business-representative-form-step.scss',
})
export class BusinessRepresentativeFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: Representative = {};
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.representative = new Representative(response.data.representative || {});
      this.formController.setInitialValues({ ...this.representative });
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
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
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.patchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: BusinessFormServerErrors.patchData });
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response, metadata: { completedStep: 'representative' }});
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(identitySchema('representative', this.allowOptionalFields));
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
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
                  error={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-text
                  name="title"
                  label="Title"
                  defaultValue={representativeDefaultValue?.title}
                  error={this.errors.title}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="email"
                  label="Email Address"
                  defaultValue={representativeDefaultValue?.email}
                  error={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-number-masked
                  name="phone"
                  label="Phone Number"
                  defaultValue={representativeDefaultValue?.phone}
                  error={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-date
                  name="dob_full"
                  label="Birth Date"
                  defaultValue={representativeDefaultValue?.dob_full}
                  error={this.errors.dob_full}
                  inputHandler={this.inputHandler}
                  onFormControlInput={this.onDateOfBirthUpdate}
                />
              </div>
              <div class="col-12 col-md-8">
                <form-control-number
                  name="identification_number"
                  label="SSN"
                  defaultValue={representativeDefaultValue?.identification_number}
                  error={this.errors.identification_number}
                  inputHandler={this.inputHandler}
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
