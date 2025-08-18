import { Component, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { ComponentErrorEvent } from '../../../api/ComponentEvents';
import { makeGetIdentity, makePatchIdentity, makePostIdentity } from '../payment-provisioning/payment-provisioning-actions';
import { IdentityService } from '../../../api/services/business.service';
import { CountryCode } from '../../../utils/country-codes';

@Component({
  tag: 'justifi-owner-form'
})
export class BusinessOwnerForm {
  coreComponent: HTMLOwnerFormCoreElement;

  @State() getOwner: Function;
  @State() patchOwner: Function;
  @State() postOwner: Function;
  
  @Prop() authToken: string;
  @Prop() ownerId?: string;
  @Prop() businessId?: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() removeOwner: (id: string) => void;
  @Prop() newFormOpen?: boolean;
  @Prop() ownersLength?: number;
  @Prop() country: CountryCode;

  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @Method()
  async validate(): Promise<boolean> {
    return this.coreComponent.validate();
  }

  @Method()
  async submit(): Promise<boolean> {
    return this.coreComponent.submit();
  }

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.coreComponent.validateAndSubmit({ onSuccess });
  }

  componentWillLoad() {
    this.initializeApi();
  }

  private initializeApi() {
    if (!this.authToken) { return;}
    this.getOwner = makeGetIdentity({
      authToken: this.authToken,
      identityId: this.ownerId,
      service: new IdentityService()
    });
    this.patchOwner = makePatchIdentity({
      authToken: this.authToken,
      identityId: this.ownerId,
      service: new IdentityService()
    });
    this.postOwner = makePostIdentity({
      authToken: this.authToken,
      service: new IdentityService()
    });
  }
  
  render() {
    return (
      <owner-form-core 
        ownerId={this.ownerId}
        businessId={this.businessId}
        getOwner={this.getOwner}
        patchOwner={this.patchOwner}
        postOwner={this.postOwner}
        allowOptionalFields={this.allowOptionalFields}
        removeOwner={this.removeOwner}
        newFormOpen={this.newFormOpen}
        ownersLength={this.ownersLength}
        country={this.country}
        ref={ref => this.coreComponent = ref}
      />
    )
  }
}
