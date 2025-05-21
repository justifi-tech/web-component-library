import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormController } from '../../../ui-components/form/form';
import { businessFormSchema } from '../schemas/business-form-schema';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../api';
import { Business, BusinessFormServerErrors, IBusiness } from '../../../api/Business';
import JustifiAnalytics from '../../../api/Analytics';
import { Button, Header1, StyledHost } from '../../../ui-components';
import { checkPkgVersion } from '../../../utils/check-pkg-version';
import { BusinessFormLoading } from './business-form-loading';
import { ComponentClickEvent, ComponentErrorEvent, ComponentSubmitEvent } from '../../../api/ComponentEvents';
import { BusinessFormClickActions } from '../utils';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning/payment-provisioning-actions';
import { BusinessService } from '../../../api/services/business.service';

@Component({
  tag: 'justifi-business-form',
  shadow: true
})
export class BusinessForm {
  @State() isLoading: boolean = false;
  @State() isSaving: boolean = false;
  @State() errorMessage: BusinessFormServerErrors;
  
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() hideErrors?: boolean = false;
  @Prop() formTitle?: string = 'Business Information';
  @Prop() removeTitle?: boolean = false;

  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;
  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  
  private getBusiness: Function;
  private patchBusiness: Function;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.formController = new FormController(businessFormSchema);
    this.initializeApi();
  }

  disconnectedCallback() {
    this.analytics?.cleanup(); 
  };

  get title() {
    return this.removeTitle ? '' : this.formTitle;
  }

  get disabledState() {
    return this.isSaving;
  }

  get businessEndpoint() {
    return `entities/business/${this.businessId}`
  }

  private formController: FormController;

  instantiateBusiness = (data: IBusiness) => {
    const business = new Business(data);
    this.formController.setInitialValues({ ...business });
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

      this.getBusiness({
        onSuccess: (response) => {
          this.instantiateBusiness(response.data);
        },
        onError: ({ error, code, severity }) => {
          this.errorMessage = error.message;
          this.errorEvent.emit({ errorCode: code, message: error.message, severity });
        },
        final: () => {
          this.isLoading = false;
        }
      });

    } else {
      this.errorEvent.emit({
        message: 'auth-token and business-id are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private sendData = async () => {
    this.isSaving = true;
    const values = this.formController.values.getValue();
    const initialValues = this.formController.getInitialValues();
    const payload = new Business({ ...initialValues, ...values }).payload;
    this.patchBusiness({
      payload,
      onSuccess: (response) => {
        this.handleReponse(response);
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error.message;
        this.errorEvent.emit({ errorCode: code, message: error.message, severity });
      },
      final: () => {
        this.isSaving = false;
      }
    });
  }

  private validateAndSubmit = (event: any) => {
    event.preventDefault();
    this.formController.validateAndSubmit(this.sendData);
  }

  handleReponse(response) {
    if (response.error) {
      this.errorMessage = BusinessFormServerErrors.patchData;
    }
    this.submitEvent.emit({ response });
    this.instantiateBusiness(response.data);
  }

  render() {
    if (this.isLoading) {
      return <StyledHost><BusinessFormLoading /></StyledHost>;
    }

    return (
      <StyledHost>
        <form onSubmit={this.validateAndSubmit}>
          <div class="row gap-3">
            <Header1 text={this.title} />
            <form-alert text={this.errorMessage} hideAlert={this.hideErrors} />
            <div class="col-12 mb-4">
              <justifi-business-core-info formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-legal-address-form formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-additional-questions formController={this.formController} />
            </div>
            <div class="col-12 mb-4">
              <justifi-business-representative formController={this.formController} />
            </div>
            <div class="col-12 d-flex flex-row-reverse">
              <Button
                type="submit"
                disabled={this.disabledState}
                variant='primary'
                onClick={() => this.clickEvent.emit({ name: BusinessFormClickActions.submit })}
                isLoading={this.isSaving}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </StyledHost>
    );
  }
}
