import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../form/form';
import { PHONE_MASKS } from '../../../utils/form-input-masks';
import { Api, IApiResponse } from '../../../api';
import { Identity } from '../../../api/Business';
import { parseRepresentativeInfo } from '../utils/payload-parsers';
import { ownerSchema } from '../schemas/business-identity-schema';
import { config } from '../../../../config';

@Component({
  tag: 'justifi-owner-form',
  styleUrl: 'owner-form.scss',
  shadow: true,
})
export class OwnerForm {
  @Prop() authToken: string;
  @Prop() ownerId: string;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() owner: any = {};
  @Event({ bubbles: true }) submitted: EventEmitter<{ data?: any }>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<{ data: any, message: string }>;

  private api: any;

  get identityEndpoint() {
    return `entities/identity/${this.ownerId}`
  }

  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<Identity> = await this.api.get(this.identityEndpoint);
      this.owner = response.data;
      this.formController.setInitialValues(this.owner);
    } catch (error) {
      this.serverError.emit({ data: error, message: 'bad bad bad' });
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = parseRepresentativeInfo(this.formController.values.getValue());
      const response = await this.api.patch(this.identityEndpoint, JSON.stringify({ representative: payload }));
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.serverError.emit({ data: error, message: 'bad bad bad' });
    } finally {
      this.formLoading.emit(false);
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError.emit({ data: response.error, message: 'bad bad bad' });
    } else {
      onSuccess();
    }
    this.submitted.emit({ data: response });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingOwnerId = 'Warning: Missing owner-id. The form requires an existing owner-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.ownerId) console.error(missingOwnerId);

    this.formController = new FormController(ownerSchema);
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
    this.formController.values.subscribe(
      values => (this.owner = { ...values }),
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

  render() {

    const ownerDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Owner</legend>
            <hr />
            <div class="row gy-3">
              <div class="col-12 col-md-8">
                <form-control-text
                  name="name"
                  label="Full Name"
                  defaultValue={ownerDefaultValue?.name}
                  error={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-select
                  name="title"
                  label="Prefix"
                  defaultValue={ownerDefaultValue?.title}
                  options={[
                    { label: 'Select Prefix', value: '' },
                    { label: 'Mrs.', value: 'Mrs.' },
                  ]}
                  error={this.errors.title}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="email"
                  label="Email Address"
                  defaultValue={ownerDefaultValue?.email}
                  error={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-number-masked
                  name="phone"
                  label="Phone Number"
                  defaultValue={ownerDefaultValue?.phone}
                  error={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
              <div class="col-12">
                <label part="label" class="form-label">
                  Birth Date
                </label>
              </div>
              <div class="col-12 col-md-4">
                <form-control-datepart
                  name="dob_day"
                  label="Day"
                  defaultValue={ownerDefaultValue?.dob_day}
                  error={this.errors.dob_day}
                  inputHandler={this.inputHandler}
                  type="day"
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-datepart
                  name="dob_month"
                  label="Month"
                  defaultValue={ownerDefaultValue?.dob_month}
                  error={this.errors.dob_month}
                  inputHandler={this.inputHandler}
                  type="month"
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-datepart
                  name="dob_year"
                  label="Year"
                  defaultValue={ownerDefaultValue?.dob_year}
                  error={this.errors.dob_year}
                  inputHandler={this.inputHandler}
                  type="year"
                />
              </div>
              <div class="col-12">
                <form-control-number
                  name="identification_number"
                  label="EIN/SSN"
                  defaultValue={ownerDefaultValue?.identification_number}
                  error={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <justifi-business-address-form
                  errors={this.errors.address}
                  defaultValues={ownerDefaultValue?.address}
                  handleFormUpdate={values => this.onAddressFormUpdate(values)}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
