import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../form/form';
import { PHONE_MASKS } from '../../../utils/form-input-masks';
import Api, { IApiResponse } from '../../../api/Api';
import { IBusiness } from '../../../api/Business';
import { parseRepresentativeInfo } from '../helpers';
import { representativeSchema } from '../business-form-schema';
import { config } from '../../../../config';

@Component({
  tag: 'justifi-business-representative-form-step',
  styleUrl: 'business-representative-form-step.scss',
})
export class BusinessRepresentativeFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() isLoading: boolean = false;
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: any = {};
  @Event({ bubbles: true }) submitted: EventEmitter<{ data?: any }>;

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
    this.onAddressFormUpdate = this.onAddressFormUpdate.bind(this);
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private async fetchData() {
    this.isLoading = true;
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.representative = response.data.representative;
      this.formController.setInitialValues(this.representative);
    } catch (error) {
      this.serverError = true;
      this.errorMessage = `Error fetching data: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  private async sendData(onSuccess?: () => void) {
    this.isLoading = true;
    try {
      const payload = parseRepresentativeInfo(this.formController.values.getValue());
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify({ representative: payload }));
      this.handleResponse(response, onSuccess);
    } catch (error) {
      this.serverError = true;
      this.errorMessage = `Error sending data: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  handleResponse(response, onSuccess) {
    if (response.error) {
      this.serverError = true;
      this.errorMessage = response.error.message;
    } else {
      this.serverError = false;
      onSuccess();
    }
    this.submitted.emit({ data: response });
  }

  @Method()
  async validateAndSubmit(onSuccess: () => Promise<void>) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.formController = new FormController(representativeSchema);
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

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  onAddressFormUpdate(values: any): void {
    this.formController.setValues({
      ...this.formController.values.getValue(),
        address: {
          ...this.formController.values.getValue().address,
          ...values,
        }
    });
  }

  render() {
    const representativeDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={() => this.sendData}>
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
                <form-control-select
                  name="title"
                  label="Prefix"
                  defaultValue={representativeDefaultValue?.title}
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
              <div class="col-12">
                <label part="label" class="form-label">
                  Birth Date
                </label>
              </div>
              <div class="col-12 col-md-4">
                <form-control-datepart
                  name="dob_day"
                  label="Day"
                  defaultValue={representativeDefaultValue?.dob_day}
                  error={this.errors.dob_day}
                  inputHandler={this.inputHandler}
                  type="day"
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-datepart
                  name="dob_month"
                  label="Month"
                  defaultValue={representativeDefaultValue?.dob_month}
                  error={this.errors.dob_month}
                  inputHandler={this.inputHandler}
                  type="month"
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-datepart
                  name="dob_year"
                  label="Year"
                  defaultValue={representativeDefaultValue?.dob_year}
                  error={this.errors.dob_year}
                  inputHandler={this.inputHandler}
                  type="year"
                />
              </div>
              <div class="col-12">
                <form-control-number
                  name="identification_number"
                  label="EIN/SSN"
                  defaultValue={representativeDefaultValue?.identification_number}
                  error={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <justifi-business-address-form
                  errors={this.errors.address}
                  defaultValues={representativeDefaultValue?.address}
                  onFormUpdate={values => this.onAddressFormUpdate(values)}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
