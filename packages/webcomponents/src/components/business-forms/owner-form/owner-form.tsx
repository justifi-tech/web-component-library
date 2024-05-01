import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { FormController } from '../../form/form';
import { PHONE_MASKS } from '../../../utils/form-input-masks';
import { Api, IApiResponse } from '../../../api';
import { Identity, Owner } from '../../../api/Identity';
import { parseIdentityInfo } from '../utils/payload-parsers';
import { identitySchema } from '../schemas/business-identity-schema';
import { config } from '../../../../config';
import { LoadingSpinner } from '../../form/utils';
import { 
  OwnerFormSubmitEvent, 
  OwnerFormServerErrorEvent, 
  OwnerFormServerErrors, 
  OwnerFormClickEvent, 
  OwnerFormClickActions} 
  from '../utils/business-form-types';

@Component({
  tag: 'justifi-owner-form',
  styleUrl: 'owner-form.scss',
  shadow: true,
})
export class BusinessOwnerForm {
  @Prop() authToken: string;
  @Prop() ownerId?: string;
  @Prop() businessId?: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() removeOwner: (id: string) => void;
  @Prop() newFormOpen?: boolean;
  @Prop() ownersLength?: number;
  @State() isLoading: boolean = false;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() owner: Owner = {};
  @Event({ bubbles: true }) submitted: EventEmitter<OwnerFormSubmitEvent>;
  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<OwnerFormClickEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<OwnerFormServerErrorEvent>;

  private api: any;

  get identityEndpoint() {
    return this.ownerId ? `entities/identity/${this.ownerId}` : 'entities/identity';
  }

  get formTitle() {
    return this.ownerId ? 'Edit Business Owner' : 'Add Business Owner';
  }

  get submitButtonText() {
    return this.ownerId ? 'Update' : 'Add';
  }

  get showRemoveButton() {
    const blankForm = !this.ownerId && this.newFormOpen;
    if (this.ownersLength <= 1) {
      return false
    } else {
      if (blankForm) {
        return true;
      } else if (this.ownerId && !this.newFormOpen) {
        return true;
      }
    }
  }

  @Watch('isLoading')
  loadingWatcher() {
    this.formLoading.emit(this.isLoading);
  }

  private fetchData = async () => {
    if (!this.ownerId) {
      this.owner = { ...new Owner({}) };
      this.formController.setInitialValues(this.owner);
      return;
    }
    this.isLoading = true;
    try {
      const response: IApiResponse<Identity> = await this.api.get(this.identityEndpoint);
      this.owner = { ...new Owner(response.data)};
      this.formController.setInitialValues(this.owner);
    } catch (error) {
      this.serverError.emit({ data: error, message: OwnerFormServerErrors.fetchData });
    } finally {
      this.isLoading = false;
    }
  }

  private sendData = async () => {
    this.isLoading = true;
    try {
      if (this.ownerId) {
        const payload = parseIdentityInfo(this.formController.values.getValue());
        const response = await this.api.patch(this.identityEndpoint, JSON.stringify(payload));
        return this.handleResponse(response);
      } else {
        const payload = { ...parseIdentityInfo(this.formController.values.getValue()), business_id: this.businessId};
        const response = await this.api.post(this.identityEndpoint, JSON.stringify(payload));
        this.ownerId = response.data.id;
        return this.handleResponse(response);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      this.isLoading = false;
    }
  }

  handleResponse(response: any) {
    this.submitted.emit({ data: response, metadata: { ownerId: this.ownerId }});
    let errorMessage = this.ownerId ? OwnerFormServerErrors.patchData : OwnerFormServerErrors.postData;
    if (response.error) {
      this.serverError.emit({ data: response.error, message: errorMessage });
      return false;
    } else {
      return true;
    }
  }

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    if (!this.authToken) console.error(missingAuthTokenMessage);

    this.formController = new FormController(identitySchema('owner', this.allowOptionalFields));
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

  handleAddOwner = () => {
    const eventName = this.ownerId ? OwnerFormClickActions.updateOwner : OwnerFormClickActions.addOwner;
    this.clickEvent.emit({ name: eventName });
  }

  handleRemoveOwner = () => {
    this.removeOwner(this.ownerId);
    this.clickEvent.emit({ name: OwnerFormClickActions.removeOwner });
  }

  @Method()
  async validate(): Promise<boolean> {
    return this.formController.validate();
  }

  @Method()
  async submit(): Promise<boolean> {
    return this.sendData();
  }

  validateAndSubmit = (event: any) => {
    event.preventDefault();
    const isValid = this.formController.validate();
    if (isValid) {
      this.submit();
    }
  }

  render() {

    const ownerDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={this.validateAndSubmit}>
          <fieldset>
            <legend>{this.formTitle}</legend>
            <div class='row gy-3'>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="name"
                  label="Full Name"
                  defaultValue={ownerDefaultValue?.name}
                  error={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-text
                  name="title"
                  label="Title"
                  defaultValue={ownerDefaultValue?.title}
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
                <justifi-identity-address-form
                  errors={this.errors.address}
                  defaultValues={ownerDefaultValue?.address}
                  handleFormUpdate={this.onAddressFormUpdate}
                />
              </div>
              <div class="container d-flex gap-2">
                <button
                  type="submit"
                  class={`btn btn-primary jfi-submit-button${this.isLoading ? ' jfi-submit-button-loading' : ''}`}
                  onClick={() => this.handleAddOwner()}
                  disabled={this.isLoading}>
                  {this.isLoading ? LoadingSpinner() : this.submitButtonText}
                </button>
                {this.showRemoveButton &&
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => this.handleRemoveOwner()}>
                    Remove owner
                  </button>}
              </div>
            </div>
            <hr />
          </fieldset>
        </form>
      </Host>
    );
  }
}
