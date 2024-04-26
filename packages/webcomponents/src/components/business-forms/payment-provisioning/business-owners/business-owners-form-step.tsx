import { Component, Host, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { IBusiness } from '../../../../api/Business';
import { Api, IApiResponse } from '../../../../api';
import { config } from '../../../../../config';
import { Owner } from '../../../../api/Identity';
import { 
  BusinessFormServerErrorEvent, 
  BusinessFormServerErrors, 
  BusinessFormSubmitEvent, 
  OwnerFormClickActions, 
  OwnerFormClickEvent } 
  from '../../utils/business-form-types';

/**
 * @exportedPart label: Label for inputs
 * @exportedPart input: The input fields
 * @exportedPart input-invalid: Invalid state for inputfs
 */
@Component({
  tag: 'justifi-business-owners-form-step',
  styleUrl: 'business-owners-form-step.scss',
  shadow: false,
})
export class BusinessOwnersFormStep {
  @Prop() authToken: string;
  @Prop() businessId: string;
  @State() owners: Owner[] = [];
  @State() newFormOpen: boolean;
  @State() refs = [];
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<OwnerFormClickEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event() serverError: EventEmitter<BusinessFormServerErrorEvent>;

  private api: any;

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  get showAddOwnerButton() {
    return this.owners.length < 4 && !this.newFormOpen;
  }

  private manageRefs() {
    const ownerRefs = this.owners.map((owner) => owner.id);
    this.refs = ownerRefs;
  }

  private managePayload = async () => {
    const payload = this.owners.filter((owner) => owner.id).map((owner) => {
      return { id: owner.id };
    });
    return payload;
  }

  private matchRef = (ref: any, ownerId: string) => {
    const ownerIndex = this.refs.findIndex(ref => ref === ownerId);
    if (ownerIndex !== -1) {
      this.refs[ownerIndex] = ref;
    }
  }
  
  private fetchData = async () => {
    this.formLoading.emit(true);
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(this.businessEndpoint);
      if (response.data.owners.length) {
        this.owners = response.data.owners.map(owner => owner);
      } else {
        this.addOwnerForm();
      }
    } catch (error) {
      this.serverError.emit({ data: error, message: BusinessFormServerErrors.fetchData });
    } finally {
      this.formLoading.emit(false);
      this.manageRefs();
    }
  }

  private sendData = async (onSuccess?: () => void) => {
    this.formLoading.emit(true);
    try {
      const payload = await this.managePayload();
      const response = await this.api.patch(this.businessEndpoint, JSON.stringify({owners: payload}));
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
    this.submitted.emit({ data: response, metadata: { completedStep: 'owners' } });
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    const formValidations = this.refs.map(ref => ref.validate());
    const formsValid = (await Promise.all(formValidations)).every(result => result);
    if (!formsValid) { return; }

    const formSubmissions = this.refs.map(ref => ref.submit());
    const submissionsValid = (await Promise.all(formSubmissions)).every(result => result);
    if (!submissionsValid) { return; }

    await this.sendData(onSuccess);
  };

  componentWillLoad() {
    const missingAuthTokenMessage = 'Warning: Missing auth-token. The form will not be functional without it.';
    const missingBusinessIdMessage = 'Warning: Missing business-id. The form requires an existing business-id to function.';
    if (!this.authToken) console.error(missingAuthTokenMessage);
    if (!this.businessId) console.error(missingBusinessIdMessage);

    this.api = Api(this.authToken, config.proxyApiOrigin);
    this.fetchData();
  }

  private addOwnerForm = (fireClick?: boolean) => {
    this.newFormOpen = true;
    const newOwner = { ...new Owner({})};
    this.owners = [...this.owners, newOwner];
    fireClick && this.clickEvent.emit({ name: OwnerFormClickActions.addOwnerForm });
  };

  private removeOwnerForm = (id: string) => {
    this.owners = this.owners.filter(owner => owner.id !== id);
    this.newFormOpen ? this.newFormOpen = false : null;
  };

  @Watch('owners')
  onOwnersUpdated() {
    this.manageRefs();
  }

  private handleOwnerSubmit = (event) => {
    const ownerData = event.detail.data.data;

    const currentIndex = this.owners.findIndex(owner => owner.id === ownerData.id);
    if (currentIndex !== -1) {
      this.owners[currentIndex] = ownerData;
    } else {
      const newOwnerIndex = this.owners.findIndex(owner => !owner.id);
      this.owners[newOwnerIndex] = ownerData;
      this.newFormOpen ? this.newFormOpen = false : null;
    }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class='col-12'>
          {this.owners.map((owner) => {
            return (
              <justifi-owner-form 
                key={owner.id}
                authToken={this.authToken} 
                businessId={this.businessId} 
                ownerId={owner.id}
                removeOwner={this.removeOwnerForm}
                newFormOpen={this.newFormOpen}
                ownersLength={this.owners.length}
                onSubmitted={(e: CustomEvent) => this.handleOwnerSubmit(e)}
                onFormLoading={(e: CustomEvent) => this.formLoading.emit(e.detail)}
                ref={(ref) => {this.matchRef(ref, owner.id)}}
              />
            );
          })}
        </div>
        {this.showAddOwnerButton && 
          <div class='col-12'>
            <button class='btn btn-primary' onClick={() => this.addOwnerForm(true)}>Add Owner</button>
          </div>
        }
      </Host>
    );
  }
}
