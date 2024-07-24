import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { deconstructDate } from '../utils/helpers';
import { FormController } from '../../form/form';
import { Identity, Owner } from '../../../api/Identity';
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormSubmitEvent } from '../utils/business-form-types';
import { ComponentError } from '../../../api/ComponentError';
import { PHONE_MASKS, SSN_MASK } from '../../../utils/form-input-masks';
import { LoadingSpinner } from '../../form/utils';
import { identitySchema } from '../schemas/business-identity-schema';

@Component({
  tag: 'owner-form-core'
})
export class BusinessOwnerFormCore {
  @State() isLoading: boolean = false;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() owner: Owner = {};

  @Prop() authToken: string;
  @Prop() ownerId?: string;
  @Prop() businessId?: string;
  @Prop() getOwner: Function;
  @Prop() patchOwner: Function;
  @Prop() postOwner: Function;
  @Prop() allowOptionalFields?: boolean;
  @Prop() removeOwner: (id: string) => void;
  @Prop() newFormOpen?: boolean;
  @Prop() ownersLength?: number;

  @Watch('isLoading')
  loadingWatcher() {
    this.formLoading.emit(this.isLoading);
  }

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<BusinessFormClickEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  @Method()
  private async validate(): Promise<boolean> {
    return this.formController.validate();
  }

  @Method()
  async submit(): Promise<boolean> {
    const isValid = await this.validate();
    if (isValid) {
      return this.sendData();
    }
  }

  @Method()
  async validateAndSubmit(event: any) {
    event.preventDefault();
    const isValid = await this.validate();
    if (isValid) {
      this.submit();
    }
  }

  get identificationNumberLabel() {
    return this.owner.ssn_last4 ? 'Update SSN (optional)' : 'SSN';
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

  componentWillLoad() {
    this.getOwner && this.getData();
    this.formController = new FormController(identitySchema('owner', this.allowOptionalFields));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
  }

  private getData = () => {
    if (!this.ownerId) {
      this.instantiateOwner({});
      return;
    }
    this.isLoading = true;
    this.getOwner({
      onSuccess: (response) => {
        this.owner = new Owner(response.data);
        this.formController.setInitialValues({ ...this.owner });
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

  private sendData = () => {
    this.isLoading = true;
    let result: boolean;
    if (this.ownerId) {
      this.patchOwner({
        payload: this.formController.values.getValue(),
        onSuccess: (response) => {
          this.submitted.emit({ data: { response } });
          result = true;
        },
        onError: ({ error, code, severity }) => {
          this.submitted.emit({ data: { error } });
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity
          });
          result = false;
        },
        final: () => this.isLoading = false
      });
    } else {
      this.postOwner({
        payload: this.formController.values.getValue(),
        onSuccess: (response) => {
          this.submitted.emit({ data: { response } });
          result = true;
        },
        onError: ({ error, code, severity }) => {
          this.submitted.emit({ data: { error } });
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity
          });
          result = false;
        },
        final: () => this.isLoading = false
      });
      return result;
    }
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

  instantiateOwner = (data: Identity) => {
    this.owner = { ...new Owner(data) };
    this.formController.setInitialValues(this.owner);
  }

  handleAddOwner = () => {
    const eventName = this.ownerId ? BusinessFormClickActions.updateOwner : BusinessFormClickActions.addOwner;
    this.clickEvent.emit({ name: eventName });
  }

  handleRemoveOwner = () => {
    this.removeOwner(this.ownerId);
    this.clickEvent.emit({ name: BusinessFormClickActions.removeOwner });
  }

  render() {
    const ownerDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={this.validateAndSubmit}>
          <fieldset>
            <legend class='fw-semibold fs-5'>{this.formTitle}</legend>
            <br />
            <div class='row gy-3'>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="name"
                  label="Full Name"
                  defaultValue={ownerDefaultValue?.name}
                  errorText={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-text
                  name="title"
                  label="Title"
                  defaultValue={ownerDefaultValue?.title}
                  errorText={this.errors.title}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="email"
                  label="Email Address"
                  defaultValue={ownerDefaultValue?.email}
                  errorText={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-number-masked
                  name="phone"
                  label="Phone Number"
                  defaultValue={ownerDefaultValue?.phone}
                  errorText={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-date
                  name="dob_full"
                  label="Birth Date"
                  defaultValue={ownerDefaultValue?.dob_full}
                  errorText={this.errors.dob_full}
                  inputHandler={this.inputHandler}
                  onFormControlInput={this.onDateOfBirthUpdate}
                />
              </div>
              <div class="col-12 col-md-8">
                <form-control-number-masked
                  name="identification_number"
                  label={this.identificationNumberLabel}
                  defaultValue={ownerDefaultValue?.identification_number}
                  errorText={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                  mask={SSN_MASK}
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
