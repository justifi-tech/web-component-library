import { Component, h, Prop, State, Event, EventEmitter, Watch, Method } from '@stencil/core';
import { ComponentErrorEvent, ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api';
import { makeGetBusiness, makePostBankAccount, makePostDocumentRecord } from '../payment-provisioning-actions';
import { BusinessService, BusinessBankAccountService, DocumentRecordService } from '../../../../api/services/business.service';

@Component({
  tag: 'justifi-business-bank-account-form-step'
})
export class BusinessBankAccountFormStep {
  coreComponent: HTMLJustifiBusinessBankAccountFormStepCoreElement;
  
  @State() getBusiness: Function;
  @State() postBankAccount: Function;
  @State() postDocumentRecord: Function;
  @State() postDocument: Function;

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() allowOptionalFields?: boolean;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }
 
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;
 
  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.coreComponent.validateAndSubmit({ onSuccess });
  }
 
  componentWillLoad() {
    this.initializeApi();
  }

  private initializeApi() {
    if (this.authToken && this.businessId) {
      this.getBusiness = makeGetBusiness({
        authToken: this.authToken,
        businessId: this.businessId,
        service: new BusinessService()
      });
      this.postBankAccount = makePostBankAccount({
        authToken: this.authToken,
        service: new BusinessBankAccountService()
      });
      this.postDocumentRecord = makePostDocumentRecord({
        authToken: this.authToken,
        service: new DocumentRecordService()
      });
    } else {
      this.errorEvent.emit({
        message: 'Missing required props',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }
  
  render() {
    return (
      <justifi-business-bank-account-form-step-core
        businessId={this.businessId}
        getBusiness={this.getBusiness}
        postBankAccount={this.postBankAccount}
        postDocumentRecord={this.postDocumentRecord}
        allowOptionalFields={this.allowOptionalFields}
        ref={el => this.coreComponent = el}
      />
    )
  }
}
