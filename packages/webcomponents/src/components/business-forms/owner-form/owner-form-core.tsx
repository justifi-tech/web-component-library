import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { FormController } from '../../form/form';
import { Identity, Owner } from '../../../api/Identity';
import { BusinessFormClickActions, BusinessFormClickEvent, BusinessFormSubmitEvent } from '../utils/business-form-types';
import { ComponentError } from '../../../api/ComponentError';
import { identitySchema } from '../schemas/business-identity-schema';
import { parseIdentityInfo } from '../utils/payload-parsers';

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
    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={this.validateAndSubmit}>
          <fieldset>
            <legend class='fw-semibold fs-5'>{this.formTitle}</legend>
            <br />
            <div class='row gy-3'>
              <owner-form-inputs
                owner={this.owner}
                ownerDefaultValue={this.formController.getInitialValues()}
                errors={this.errors}
                formController={this.formController}
              />
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
