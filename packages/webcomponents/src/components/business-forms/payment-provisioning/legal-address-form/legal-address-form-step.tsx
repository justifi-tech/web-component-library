import { Component, Host, Method, Prop, State, h, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../form/form';
import Api, { IApiResponse } from '../../../../api/Api';
import { Address, IAddress, IBusiness } from '../../../../api/Business';
import { parseAddressInfo } from '../../utils/payload-parsers';
import { addressSchema } from '../../schemas/business-address-schema';
import { config } from '../../../../../config';
import { BusinessFormServerErrorEvent, BusinessFormServerErrors, BusinessFormStep, BusinessFormSubmitEvent } from '../../utils/business-form-types';
import StateOptions from '../../../../utils/state-options';
import { numberOnlyHandler } from '../../../form/utils';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-legal-address-form-step'
})
export class LegalAddressFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress = {};
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
      this.legal_address = new Address(response.data.legal_address || {});
      this.formController.setInitialValues({ ...this.legal_address });
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = parseAddressInfo(this.formController.values.getValue());
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify({ legal_address: payload }));
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
    this.submitted.emit({ data: response, metadata: { completedStep: BusinessFormStep.legalAddress } });
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

    this.formController = new FormController(addressSchema(this.allowOptionalFields));
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
    this.fetchData();
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.legal_address = { ...values }
    );
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const legalAddressDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Business Legal Address</legend>
            <hr />
            <div class="row gx-2 gy-2">
              <div class="col-12">
                <form-control-text
                  name="line1"
                  label="Legal Address"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.line1}
                  errorText={this.errors?.line1}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="line2"
                  label="Address Line 2"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.line2}
                  errorText={this.errors?.line2}

                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="city"
                  label="City"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.city}
                  errorText={this.errors?.city}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name="state"
                  label="State"
                  options={StateOptions}
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.state}
                  error={this.errors?.state}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="postal_code"
                  label="Postal Code"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.postal_code}
                  errorText={this.errors?.postal_code}
                  maxLength={5}
                  keyDownHandler={numberOnlyHandler}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name="country"
                  label="Country"
                  options={[{ label: 'United States', value: 'USA' }]}
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.country}
                  error={this.errors?.country}
                  // just for now so we skip handling country specificities
                  disabled={true}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
