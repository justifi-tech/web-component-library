import { Component, h, Prop, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { ComponentError } from '../../../api/ComponentError';
import { makeGetIdentity, makePatchIdentity, makePostIdentity } from '../payment-provisioning/payment-provisioning-actions';
import { IdentityService } from '../../../api/services/business.service';

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

  @Watch('authToken')
  @Watch('ownerId')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }
  
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

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
    if (this.authToken && this.ownerId && this.businessId) {
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
        businessId: this.businessId,
        service: new IdentityService()
      });
    }
  }
  
  render() {
    return (
      <owner-form-core 
        authToken={this.authToken}
        ownerId={this.ownerId}
        businessId={this.businessId}
        getOwner={this.getOwner}
        patchOwner={this.patchOwner}
        postOwner={this.postOwner}
        allowOptionalFields={this.allowOptionalFields}
        removeOwner={this.removeOwner}
        newFormOpen={this.newFormOpen}
        ownersLength={this.ownersLength}
        ref={el => this.coreComponent = el}
      />
    )
  }
}
