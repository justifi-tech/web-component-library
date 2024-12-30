import { Component, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { FormController } from '../../../ui-components/form/form';
import { Identity, Owner } from '../../../api/Identity';
import { BusinessFormClickActions, ClickEvent } from '../../../api/ComponentEvents';
import { ComponentError } from '../../../api/ComponentError';
import { identitySchema } from '../schemas/business-identity-schema';
import { Button } from '../../../ui-components';
import { heading3 } from '../../../styles/parts';

@Component({
  tag: 'owner-form-core'
})
export class BusinessOwnerFormCore {
  @State() isLoading: boolean = false;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() owner: Owner = {} as Owner;

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

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ClickEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;
  @Event({ bubbles: true }) ownerSubmitted: EventEmitter<any>;

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
    let formValues = new Owner(this.formController.values.getValue()).payload;
    if (this.ownerId) {
      return formValues
    } else {
      return { ...formValues, business_id: this.businessId };
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
            this.ownerSubmitted.emit({ id: response.data.id });
            this.instantiateOwner(response.data);
            resolve(true);
          },
          onError: ({ error, code, severity }) => {
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
            this.ownerSubmitted.emit({ id: response.data.id });
            this.instantiateOwner(response.data);
            resolve(true);
          },
          onError: ({ error, code, severity }) => {
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
    this.owner = { ...new Owner(data) } as Owner;
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
      <form onSubmit={this.validateAndSubmit}>
        <fieldset>
          <legend class="fw-semibold fs-5" part={heading3}>{this.formTitle}</legend>
          <br />
          <div class="row gy-3">
            <owner-form-inputs
              ownerDefaultValue={this.formController.getInitialValues()}
              errors={this.errors}
              formController={this.formController}
            />
            <div class="d-flex gap-2 justify-content-start">
              <Button
                variant="secondary"
                type="button"
                onClick={this.handleRemoveOwner}
                hidden={!this.showRemoveButton}>
                Remove
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleAddOwner}
                disabled={this.isLoading}>
                {this.submitButtonText}
              </Button>
            </div>
          </div>
          <hr />
        </fieldset>
      </form>
    );
  }
}
