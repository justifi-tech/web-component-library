import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  Listen,
} from '@stencil/core';
import JustifiAnalytics from '../../../api/Analytics';
import {
  ComponentErrorCodes,
  ComponentErrorSeverity,
} from '../../../api/ComponentError';
import {
  makeGetBusiness,
  makePostProvisioning,
} from './payment-provisioning-actions';
import { BusinessService } from '../../../api/services/business.service';
import { ProvisionService } from '../../../api/services/provision.service';
import { checkPkgVersion } from '../../../utils/check-pkg-version';
import {
  ComponentClickEvent,
  ComponentErrorEvent,
  ComponentSubmitEvent,
} from '../../../api/ComponentEvents';
import { isTokenExpired } from '../../../utils/utils';
import { checkProvisioningStatus } from '../utils/helpers';
import { Header1, StyledHost } from '../../../ui-components';
import { text } from '../../../styles/parts';
import { BusinessFormClickActions } from '../utils/event-types';
import { CountryCode } from '../../../utils/country-codes';
import { Business } from '../../../api/Business';
import { PaymentProvisioningLoading } from './payment-provisioning-loading';
import { PaymentProvisioningAlreadyProvisioned } from './payment-provisioning-already-provisioned';
import { PaymentProvisioningSubmissionComplete } from './payment-provisioning-submission-complete';

@Component({
  tag: 'justifi-payment-provisioning',
  shadow: true,
})
export class JustifiPaymentProvisioning {
  @State() loading: boolean = false;
  @State() businessLoading: boolean = true;
  @State() businessProvisioned: boolean = false;
  @State() formSubmitted: boolean = false;
  @State() currentStep: number = 0;
  @State() errorMessage: string;
  @State() country: CountryCode = CountryCode.USA;

  @Prop() businessId!: string;
  @Prop() authToken!: string;
  @Prop() allowOptionalFields?: boolean = false;
  @Prop() formTitle?: string = 'Business Information';

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  @Listen('formCompleted')
  handleFormCompleted() {
    this.postProvisioningData();
  }

  @Listen('formLoading')
  handleFormLoading(event: CustomEvent) {
    this.loading = event.detail;
  }

  analytics: JustifiAnalytics;
  private getBusiness: Function;
  private postProvisioning: Function;
  private refs: any[] = [];

  async componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeApi();
    if (this.getBusiness) {
      await this.setBusinessProvisioned();
    } else {
      this.businessLoading = false;
    }
    this.refs = new Array(7);
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  private initializeApi() {
    if (!this.authToken || !this.businessId) {
      this.errorEvent.emit({
        message: 'auth-token and business-id are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    if (isTokenExpired(this.authToken)) {
      this.errorEvent.emit({
        message: 'auth-token is expired',
        errorCode: ComponentErrorCodes.NOT_AUTHENTICATED,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.getBusiness = makeGetBusiness({
      authToken: this.authToken,
      businessId: this.businessId,
      service: new BusinessService(),
    });
    this.postProvisioning = makePostProvisioning({
      authToken: this.authToken,
      businessId: this.businessId,
      product: 'payment',
      service: new ProvisionService(),
    });
  }

  setBusinessProvisioned = (): Promise<void> => {
    return new Promise((resolve) => {
      this.getBusiness({
        onSuccess: (response) => {
          const business = new Business(response.data);
          this.businessProvisioned = checkProvisioningStatus(business);
          this.country = business.country_of_establishment;
          if (this.businessProvisioned) {
            this.errorEvent.emit({
              message:
                'A request to provision payments for this business has already been submitted.',
              errorCode: ComponentErrorCodes.PROVISIONING_REQUESTED,
              severity: ComponentErrorSeverity.INFO,
            });
          }
          this.businessLoading = false;
          resolve();
        },
        onError: ({ error, code, severity }) => {
          this.errorEvent.emit({
            message: error,
            errorCode: code,
            severity: severity,
          });
          this.businessLoading = false;
          resolve();
        },
      });
    });
  };

  postProvisioningData = () => {
    this.postProvisioning({
      onSuccess: (response) => {
        this.formSubmitted = true;
        this.submitEvent.emit({ response: response });
      },
      onError: ({ error, code, severity }) => {
        this.submitEvent.emit({ response: { error } });
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity: severity,
        });
      },
    });
  };

  get formDisabled() {
    return this.loading || this.businessProvisioned;
  }

  get totalSteps() {
    return this.refs.length - 1;
  }

  get stepCounter() {
    return `Step ${this.currentStep + 1} of ${this.totalSteps + 1}`;
  }

  incrementSteps = () => {
    if (this.currentStep < this.totalSteps) {
      return this.currentStep++;
    }
  };

  decrementSteps = () => {
    if (this.currentStep > 0) {
      return this.currentStep--;
    }
  };

  previousStepButtonOnClick = () => {
    this.clickEvent.emit({ name: BusinessFormClickActions.previousStep });
    this.decrementSteps();
  };

  nextStepButtonOnClick = (e: any, clickEventName) => {
    e.preventDefault();
    this.clickEvent.emit({ name: clickEventName });
    const currentStep = this.refs[this.currentStep];
    currentStep.validateAndSubmit({ onSuccess: this.incrementSteps });
  };

  render() {
    if (this.businessLoading) {
      return (
        <StyledHost>
          <PaymentProvisioningLoading />
        </StyledHost>
      );
    }

    if (this.businessProvisioned) {
      return (
        <StyledHost>
          <PaymentProvisioningAlreadyProvisioned />
        </StyledHost>
      );
    }

    if (this.formSubmitted) {
      return (
        <StyledHost>
          <PaymentProvisioningSubmissionComplete />
        </StyledHost>
      );
    }

    return (
      <StyledHost>
        <div class="row gap-3">
          <Header1 text={this.formTitle} />
          <payment-provisioning-form-steps
            businessId={this.businessId}
            authToken={this.authToken}
            refs={this.refs}
            currentStep={this.currentStep}
            allowOptionalFields={this.allowOptionalFields}
            country={this.country}
            handleFormLoading={this.handleFormLoading}
          />
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center" part={text}>
              {this.stepCounter}
            </div>
            <payment-provisioning-form-buttons
              currentStep={this.currentStep}
              totalSteps={this.totalSteps}
              formLoading={this.loading}
              formDisabled={this.formDisabled}
              previousStepButtonOnClick={this.previousStepButtonOnClick}
              nextStepButtonOnClick={this.nextStepButtonOnClick}
            />
          </div>
        </div>
      </StyledHost>
    );
  }
}
