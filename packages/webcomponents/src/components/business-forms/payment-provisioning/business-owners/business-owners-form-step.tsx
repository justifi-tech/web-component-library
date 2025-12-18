import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch, Listen } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { ComponentErrorEvent, ComponentClickEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { Button } from '../../../../ui-components';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormClickActions, BusinessFormStep } from '../../utils/event-types';
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
  @State() representativeIsOwner: boolean = false;
  @State() representative: Representative | null = null;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country: CountryCode;

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
        // Store representative data
        if (response.data.representative) {
          this.representative = new Representative(response.data.representative);
          // Check if representative is already marked as owner
          this.representativeIsOwner = response.data.representative.is_owner || false;
        }
        
        if (response.data.owners.length) {
          this.ownersPayload = response.data.owners.map(owner => ({ id: owner.id }));
          // If representative is owner and not in owners list, add it
          if (this.representativeIsOwner && this.representative?.id) {
            const representativeInOwners = this.ownersPayload.some(owner => owner.id === this.representative.id);
            if (!representativeInOwners) {
              this.ownersPayload = [{ id: this.representative.id }, ...this.ownersPayload];
            }
          }
        } else {
          // If representative is owner and no owners exist, add representative as owner
          if (this.representativeIsOwner && this.representative?.id) {
            this.ownersPayload = [{ id: this.representative.id }];
          } else {
            this.addOwnerForm();
          }
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
    
    // If representative is owner, ensure representative ID is in owners payload
    let ownersPayload = [...this.ownersPayload];
    if (this.representativeIsOwner && this.representative?.id) {
      const representativeInOwners = ownersPayload.some(owner => owner.id === this.representative.id);
      if (!representativeInOwners) {
        ownersPayload = [{ id: this.representative.id }, ...ownersPayload];
      }
    }
    
    // Prepare payload with owners and representative is_owner status
    const payload: any = { owners: ownersPayload };
    if (this.representative) {
      const representativePayload = new Representative(this.representative).payload;
      representativePayload.is_owner = this.representativeIsOwner;
      payload.representative = representativePayload;
    }
    
    this.patchBusiness({
      payload: payload,
      onSuccess: (response) => {
        submittedData = response;
        if (this.representative) {
          this.representative.is_owner = this.representativeIsOwner;
        }
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

  private updateRepresentativeIsOwner = (isOwner: boolean) => {
    if (!this.representative || !this.patchBusiness) return;
    
    const representativePayload = new Representative(this.representative).payload;
    representativePayload.is_owner = isOwner;
    
    this.patchBusiness({
      payload: { representative: representativePayload },
      onSuccess: () => {
        // Update local representative state
        if (this.representative) {
          this.representative.is_owner = isOwner;
        }
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity
        });
      }
    });
  };

  private handleRepresentativeIsOwnerChange = (checked: boolean) => {
    this.representativeIsOwner = checked;
    
    if (checked && this.representative) {
      // If representative is owner and no owners exist, add representative as first owner
      if (this.ownersPayload.length === 0 || (this.ownersPayload.length === 1 && !this.ownersPayload[0].id)) {
        if (this.representative.id) {
          this.ownersPayload = [{ id: this.representative.id }];
        } else {
          // Representative doesn't have ID yet, populate first form with representative data
          if (this.ownersPayload.length === 0) {
            this.ownersPayload = [{ id: '' }];
          }
        }
      } else if (this.representative.id) {
        // Add representative ID to owners if not already present
        const representativeInOwners = this.ownersPayload.some(owner => owner.id === this.representative.id);
        if (!representativeInOwners) {
          this.ownersPayload = [{ id: this.representative.id }, ...this.ownersPayload];
        }
      }
      // Update representative is_owner to true
      this.updateRepresentativeIsOwner(true);
    } else if (!checked && this.representative?.id) {
      // Remove representative from owners if unchecked
      this.ownersPayload = this.ownersPayload.filter(owner => owner.id !== this.representative.id);
      if (this.ownersPayload.length === 0) {
        this.addOwnerForm();
      }
      // Update representative is_owner to false
      this.updateRepresentativeIsOwner(false);
    }
  };

  private removeOwnerForm = (id: string) => {
    // Check if the removed owner is the representative
    const isRepresentative = this.representative?.id === id;
    
    this.ownersPayload = this.ownersPayload.filter(owner => owner.id !== id);
    this.newFormOpen && (this.newFormOpen = false);
    
    // If the removed owner is the representative, update representative is_owner to false
    if (isRepresentative) {
      this.representativeIsOwner = false;
      this.updateRepresentativeIsOwner(false);
    }
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
      return (
        <Host>
          <PaymentProvisioningLoading />
        </Host>
      );
    }

    return (
      <Host>
        <div>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Owners</legend>
            <form-control-tooltip helpText="For partnerships, LLCs or privately held corporations, the business is required to apply with all individuals with 25% or more ownership to the application. For charities and registered non-profits, the business is required to apply with 1 individual with substantial control over the entity, such as a board member or director." />
          </div>
          <hr class="mt-2" />
          {this.representative && (
            <div class="mb-3">
              <form-control-checkbox
                name="representativeIsOwner"
                label="The representative is also an owner"
                inputHandler={(_name, value) => this.handleRepresentativeIsOwnerChange(value)}
                checked={this.representativeIsOwner}
              />
            </div>
          )}
          <div class='row gy-3'>
            {this.ownersPayload.map((owner, index) => {
              // Pass representative data to first owner form if it's a new form and representative is owner
              const shouldPopulateWithRepresentative = 
                this.representativeIsOwner && 
                !owner.id && 
                index === 0 && 
                this.representative;
              
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
                  initialRepresentativeData={shouldPopulateWithRepresentative ? this.representative : undefined}
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
