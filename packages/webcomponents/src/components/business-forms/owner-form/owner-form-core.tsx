import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { FormController } from '../../form/form';
import { Identity, Owner } from '../../../api/Identity';
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormSubmitEvent } from '../utils/business-form-types';
import { ComponentError } from '../../../api/ComponentError';
import { PHONE_MASKS, SSN_MASK } from '../../../utils/form-input-masks';
import { identitySchema } from '../schemas/business-identity-schema';
import { parseIdentityInfo } from '../utils/payload-parsers';
import { updateAddressFormValues, updateDateOfBirthFormValues, updateFormValues } from '../utils/input-handlers';

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
  @Event({ bubbles: true }) ownerSubmitted: EventEmitter<any>;
  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<BusinessFormClickEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  constructor() {
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
    this.validateAndSubmit = this.validateAndSubmit.bind(this);
  }

  @Method()
  async returnOwnerData() {
    return this.ownerId;
  }

  @Method()
   async validate(): Promise<boolean> {
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

  get payload() {
    let formValues = parseIdentityInfo(this.formController.values.getValue());
    if (this.ownerId) {
      return JSON.stringify(formValues);
    } else {
      return JSON.stringify({ ...formValues, business_id: this.businessId });
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
    this.formController = new FormController(identitySchema('owner', this.allowOptionalFields));
    this.ownerId ? this.getData() : this.instantiateOwner({});
  }

  componentDidLoad() {
    this.formController.errors.subscribe(
      errors => (this.errors = { ...errors }),
    );
  }

  private getData = () => {
    this.isLoading = true;
    this.getOwner({
      onSuccess: (response) => {
        this.instantiateOwner(response.data);
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => this.isLoading = false
    });
  }

  private sendData = (): Promise<boolean> => {
    this.isLoading = true;

    return new Promise((resolve) => {
      if (this.ownerId) {
        this.patchOwner({
          payload: this.payload,
          onSuccess: (response) => {
            this.submitted.emit({
              data: response,
              metadata: { ownerID: response.data.id }
            });
            this.ownerSubmitted.emit({ id: response.data.id });
            this.instantiateOwner(response.data);
            resolve(true);
          },
          onError: ({ error, code, severity }) => {
            this.submitted.emit({ data: { error } });
            this.errorEvent.emit({
              message: error,
              errorCode: code,
              severity: severity
            });
            resolve(false);
          },
          final: () => this.isLoading = false
        });
      } else {
        this.postOwner({
          payload: this.payload,
          onSuccess: (response) => {
            this.submitted.emit({ 
              data: response,
              metadata: { ownerID: response.data.id }
            });
            this.ownerSubmitted.emit({ id: response.data.id });
            this.instantiateOwner(response.data);
            resolve(true);
          },
          onError: ({ error, code, severity }) => {
            this.submitted.emit({ data: { error } });
            this.errorEvent.emit({
              message: error,
              errorCode: code,
              severity: severity
            });
            resolve(false);
          },
          final: () => this.isLoading = false
        });
      }
    });
  }

  inputHandler = (name: string, value: string) => {
    updateFormValues(this.formController, { [name]: value });
  }

  onAddressFormUpdate = (values: any): void => {
    updateAddressFormValues(this.formController, {
      ...this.formController.values.getValue().address,
      ...values,
    });
  }

  instantiateOwner = async (data: Identity) => {
    this.owner = { ...new Owner(data) };
    await this.formController.setInitialValues(this.owner);
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
    const ownerDefaultValue = this.formController.getInitialValues();

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
                  defaultValue={ownerDefaultValue.name}
                  errorText={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-text
                  name="title"
                  label="Title"
                  defaultValue={ownerDefaultValue.title}
                  errorText={this.errors.title}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-text
                  name="email"
                  label="Email Address"
                  defaultValue={ownerDefaultValue.email}
                  errorText={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12 col-md-6">
                <form-control-number-masked
                  name="phone"
                  label="Phone Number"
                  defaultValue={ownerDefaultValue.phone}
                  errorText={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
              <div class="col-12 col-md-4">
                <form-control-date
                  name="dob_full"
                  label="Birth Date"
                  defaultValue={ownerDefaultValue.dob_full}
                  errorText={this.errors.dob_full}
                  inputHandler={this.inputHandler}
                  onFormControlInput={(e) => updateDateOfBirthFormValues(e, this.formController)}
                />
              </div>
              <div class="col-12 col-md-8">
                <form-control-number-masked
                  name="identification_number"
                  label={this.identificationNumberLabel}
                  defaultValue={ownerDefaultValue.identification_number}
                  errorText={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                  mask={SSN_MASK}
                />
              </div>
              <div class="col-12">
                <justifi-identity-address-form
                  errors={this.errors.address}
                  defaultValues={ownerDefaultValue.address}
                  handleFormUpdate={this.onAddressFormUpdate}
                />
              </div>
              <owner-form-buttons 
                isLoading={this.isLoading}
                showRemoveButton={this.showRemoveButton}
                submitButtonText={this.submitButtonText}
                handleAddOwner={this.handleAddOwner}
                handleRemoveOwner={this.handleRemoveOwner}
              />
            </div>
            <hr />
          </fieldset>
        </form>
      </Host>
    );
  }
}
