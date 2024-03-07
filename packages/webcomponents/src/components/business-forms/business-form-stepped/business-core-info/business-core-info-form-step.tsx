import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import { PHONE_MASKS, TAX_ID_MASKS } from '../../../../utils/form-input-masks';
import { BusinessFormServerErrors, CoreBusinessInfo, IBusiness, ICoreBusinessInfo } from '../../../../api/Business';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { parseCoreInfo } from '../../utils/parsers';
import { flattenNestedObject } from '../../../../utils/utils';
import { BusinessStructureOptions, BusinessTypeOptions, coreInfoSchema } from '../../schemas/business-core-info-form-schema';

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
  tag: 'justifi-business-core-info-form-step',
  styleUrl: 'business-core-info-form-step.scss',
})
export class BusinessCoreInfoFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() coreInfo: ICoreBusinessInfo = {};
  @Event({ bubbles: true }) submitted: EventEmitter<{ data?: any}>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<{ data: any, message: BusinessFormServerErrors }>;

  constructor() {
    this.inputHandler = this.inputHandler.bind(this);
    this.sendData = this.sendData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private async fetchData() {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      this.coreInfo = new CoreBusinessInfo(response.data);
      this.formController.setInitialValues({ ...this.coreInfo });
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  private async sendData(onSuccess?: () => void) {
    this.formLoading.emit(true);
    try {
      const payload = parseCoreInfo(flattenNestedObject(this.formController.values.getValue()));
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify(payload));
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

    this.formController = new FormController(coreInfoSchema);
    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.values.subscribe(values => 
      this.coreInfo = { ...values }
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler(name: string, value: string) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const coreInfoDefaultValue = this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>General Info</legend>
            <hr />
            <div class="row gy-3">
              <div class="col-12 col-md-6">
                <form-control-text
                  name="legal_name"
                  label="Legal Name"
                  defaultValue={coreInfoDefaultValue.legal_name}
                  error={this.errors.legal_name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="doing_business_as"
                  label="Doing Business As (DBA)"
                  defaultValue={coreInfoDefaultValue.doing_business_as}
                  error={this.errors.doing_business_as}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-select
                  name="business_type"
                  label="Business Type"
                  options={BusinessTypeOptions}
                  defaultValue={coreInfoDefaultValue.business_type}
                  error={this.errors.business_type}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-select
                  name="business_structure"
                  label="Business Structure"
                  options={BusinessStructureOptions}
                  defaultValue={coreInfoDefaultValue.business_structure}
                  error={this.errors.business_structure}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="industry"
                  label="Industry"
                  defaultValue={coreInfoDefaultValue.industry}
                  error={this.errors.industry}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-number-masked
                  name="tax_id"
                  label="Tax ID"
                  defaultValue={coreInfoDefaultValue.tax_id}
                  error={this.errors.tax_id}
                  inputHandler={this.inputHandler}
                  mask={TAX_ID_MASKS.US}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="website_url"
                  label="Website URL"
                  defaultValue={coreInfoDefaultValue.website_url}
                  error={this.errors.website_url}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="email"
                  label="Email Address"
                  defaultValue={coreInfoDefaultValue.email}
                  error={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-number-masked
                  name="phone"
                  label="Phone Number"
                  defaultValue={coreInfoDefaultValue.phone}
                  error={this.errors.phone}
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
