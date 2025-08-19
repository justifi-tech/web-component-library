import { Component, h, Prop, State, Event, EventEmitter, Method, Listen, Watch } from '@stencil/core';
import { Button } from '../../../../ui-components';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { ComponentErrorEvent, ComponentClickEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { BusinessFormClickActions, BusinessFormStep } from '../../utils/event-types';
import { CountryCode } from '../../../../utils/country-codes';

interface ownerPayloadItem { id: string; }

@Component({
  tag: 'justifi-business-owners-form-step-core'
})
export class BusinessOwnersFormStepCore {
  @State() ownersPayload: ownerPayloadItem[] = [];
  @State() refs: any = [];
  @State() newFormOpen: boolean;
  @State() isLoading: boolean = false;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country: CountryCode;


  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading event
  @Event() formLoading: EventEmitter<boolean>;


  get showAddOwnerButton() {
    return this.ownersPayload.length < 4 && !this.newFormOpen;
  }

  private manageRefs() {
    this.refs = this.ownersPayload.map((owner) => { return owner.id });
  }

  private matchRef = (ref: any, ownerId: string) => {
    const ownerIndex = this.refs.findIndex(ref => ref === ownerId);
    if (ownerIndex !== -1) {
      this.refs[ownerIndex] = ref;
    }
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        if (response.data.owners.length) {
          this.ownersPayload = response.data.owners.map(owner => ({ id: owner.id }));
        } else {
          this.addOwnerForm();
        }
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.formLoading.emit(false);
        this.isLoading = false;
        this.manageRefs();
      }
    });
  }

  private sendData = async (onSuccess?: () => void) => {
    let submittedData;
    this.formLoading.emit(true);
    this.patchBusiness({
      payload: { owners: this.ownersPayload },
      onSuccess: (response) => {
        submittedData = response;
        onSuccess();
      },
      onError: ({ error, code, severity }) => {
        submittedData = error;
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.owners });
        this.formLoading.emit(false)
      }
    });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    const formValidations = this.refs.map(ref => ref.validate());
    const formsValid = (await Promise.all(formValidations)).every(result => result);
    if (!formsValid) { return; }

    const formSubmissions = this.refs.map(ref => ref.submit());
    const submissionsValid = (await Promise.all(formSubmissions)).every(result => result);
    if (!submissionsValid) { return; }

    this.sendData(onSuccess);
  };

  componentWillLoad() {
    this.getBusiness && this.getData();
  }

  private addOwnerForm = (fireClick?: boolean) => {
    this.newFormOpen = true;
    this.ownersPayload = [...this.ownersPayload, { id: '' }];
    fireClick && this.clickEvent.emit({ name: BusinessFormClickActions.addOwnerForm });
  };

  private removeOwnerForm = (id: string) => {
    this.ownersPayload = this.ownersPayload.filter(owner => owner.id !== id);
    this.newFormOpen && (this.newFormOpen = false);
  };

  @Watch('ownersPayload')
  ownersWatcher() {
    this.manageRefs();
  }

  @Listen('ownerSubmitted')
  handleOwnerSubmit(event) {
    const submittedOwner = event.detail;
    const updatedOwners = this.ownersPayload.map(owner =>
      owner.id === submittedOwner.id ? submittedOwner : owner
    );

    if (!updatedOwners.includes(submittedOwner)) {
      const newOwnerIndex = this.ownersPayload.findIndex(owner => !owner.id);
      updatedOwners[newOwnerIndex] = submittedOwner;
      this.newFormOpen && (this.newFormOpen = false);
    }
    this.ownersPayload = updatedOwners;
  }

  render() {
    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <div>
        <div class="d-flex align-items-center gap-2">
          <legend class="mb-0" part={heading2}>Owners</legend>
          <form-control-tooltip helpText="For partnerships, LLCs or privately held corporations, the business is required to apply with all individuals with 25% or more ownership to the application. For charities and registered non-profits, the business is required to apply with 1 individual with substantial control over the entity, such as a board member or director." />
        </div>
        <hr class="mt-2" />
        <div class='row gy-3'>
          {this.ownersPayload.map((owner) => {
            return (
              <justifi-owner-form
                key={owner.id}
                authToken={this.authToken}
                businessId={this.businessId}
                ownerId={owner.id}
                removeOwner={this.removeOwnerForm}
                newFormOpen={this.newFormOpen}
                ownersLength={this.ownersPayload.length}
                country={this.country}
                allowOptionalFields={this.allowOptionalFields}
                ref={(ref) => this.matchRef(ref, owner.id)}
              />
            );
          })}
        </div>
        <div class='d-flex justify-content-start'>
          <div class='gap-2'>
            <Button
              variant='primary'
              onClick={() => this.addOwnerForm(true)}
              hidden={!this.showAddOwnerButton}>
              Add Owner
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
