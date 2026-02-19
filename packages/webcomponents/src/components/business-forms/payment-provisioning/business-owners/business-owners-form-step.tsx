import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch, Listen } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '@justifi/types';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { ComponentErrorEvent, ComponentClickEvent, ComponentFormStepCompleteEvent } from '@justifi/types';
import { Button } from '../../../../ui-components';
import { heading2, alert } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormClickActions, BusinessFormStep } from '@justifi/types';
import { CountryCode } from '../../../../utils/country-codes';
import { Representative } from '../../../../api/Identity';

interface ownerPayloadItem { id: string; }

@Component({
  tag: 'justifi-business-owners-form-step'
})
export class BusinessOwnersFormStep {
  @State() getBusiness: Function;
  @State() patchBusiness: Function;
  @State() ownersPayload: ownerPayloadItem[] = [];
  @State() refs: any = [];
  @State() newFormOpen: boolean;
  @State() isLoading: boolean = false;
  @State() representativeIsOwner: boolean | null = null;
  @State() representative: Representative;

  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country!: CountryCode;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event() formLoading: EventEmitter<boolean>;

  get showAddOwnerButton() {
    return this.ownersPayload.length < 4 && !this.newFormOpen;
  }

  private manageRefs() {
    this.refs = this.ownersPayload.map((owner) => { return owner.id });
  }

  private matchRef = (ref: any, ownerId: string) => {
    if (ref === null) return;
    
    const ownerIndex = this.ownersPayload.findIndex(owner => owner.id === ownerId);
    if (ownerIndex !== -1) {
      // Ensure refs array is properly sized before setting ref
      if (this.refs.length !== this.ownersPayload.length) {
        this.manageRefs();
      }
      this.refs[ownerIndex] = ref;
    }
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        this.representative = new Representative(response.data.representative || {});
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
  }

  componentWillLoad() {
    this.initializeApi();
    if (this.getBusiness) {
      this.getData();
    }
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.patchBusiness = makePatchBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
    } else {
      this.errorEvent.emit({
        message: 'Missing required props',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
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

  private handleRepresentativeIsOwnerChange = (value: boolean) => {
    this.representativeIsOwner = value;
    if (this.representativeIsOwner) {
      this.formLoading.emit(true);
      this.isLoading = true;
      this.ownersPayload = this.ownersPayload.filter(owner => owner.id !== '');
      this.patchBusiness({
        payload: {
          owners: [{ id: this.representative.id }, ...this.ownersPayload],
        },
        onSuccess: () => {
          this.getData();
          this.newFormOpen = false;
        },
        finally: () => {
          this.isLoading = false;
          this.formLoading.emit(false);
        }
      });
    }
  }

  render() {
    if (this.isLoading) {
      return (
        <Host>
          <PaymentProvisioningLoading />
        </Host>
      );
    }

    const isRepresentativeOwner = this.ownersPayload.some(owner => owner.id === this.representative.id);
    const shouldShowRepresentativeIsOwner = this.representativeIsOwner === null && !isRepresentativeOwner;

    return (
      <Host>
        <div>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Owners</legend>
            <form-control-tooltip helpText="For partnerships, LLCs or privately held corporations, the business is required to apply with all individuals with 25% or more ownership to the application. For charities and registered non-profits, the business is required to apply with 1 individual with substantial control over the entity, such as a board member or director." />
          </div>
          <hr class="mt-2" />
          {shouldShowRepresentativeIsOwner && (
            <div class={`alert alert-warning mb-3`} part={alert}>
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <strong>Is the representative of this business also an owner?</strong>
                </div>
                <div class="d-flex gap-2">
                  <Button
                    variant='primary'
                    onClick={() => this.handleRepresentativeIsOwnerChange(true)}>
                    Yes
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => this.handleRepresentativeIsOwnerChange(false)}>
                    No
                  </Button>
                </div>
              </div>
            </div>
          )}
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
      </Host>
    );
  }
}
