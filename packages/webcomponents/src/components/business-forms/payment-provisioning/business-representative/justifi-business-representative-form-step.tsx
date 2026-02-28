import { Component, h, Prop, State, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../../api/ComponentError';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { Identity, Representative } from '../../../../api/Identity';
import { FormController } from '../../../../ui-components/form/form';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { identitySchemaByCountry } from '../../schemas/business-identity-schema';
import { CountryCode } from '../../../../utils/country-codes';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormStep } from '../../utils';

@Component({
  tag: 'justifi-business-representative-form-step'
})
export class JustifiBusinessRepresentativeFormStep {
  @State() getBusiness: Function;
  @State() patchBusiness: Function;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: Identity = {};
  @State() isLoading: boolean = false;

  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country?: CountryCode;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
    this.getData();
  }

  @Event({ eventName: 'error-event', bubbles: true })
  errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'complete-form-step-event', bubbles: true })
  stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  }
  componentWillLoad() {
    this.initializeApi();
    this.initializeForm();
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

  private initializeForm() {
    const schemaFactory = identitySchemaByCountry[this.country];
    if (!schemaFactory) {
      this.errorEvent.emit({
        message: 'Missing schema for selected country',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.formController = new FormController(schemaFactory('representative', this.allowOptionalFields));
    this.getData();
  }

  componentDidLoad() {
    if (!this.formController) return;

    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  get patchPayload() {
    let formValues = new Representative(this.formController.values.getValue()).payload;
    return { representative: formValues };
  }

  private getData = () => {
    if (!this.getBusiness || !this.formController) return;

    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        this.representative = new Representative(response.data.representative || {});
        this.representative.address.country = this.country;
        this.formController.setInitialValues({ ...this.representative });
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
      }
    });
  }

  private sendData = (onSuccess: () => void) => {
    let submittedData;
    this.formLoading.emit(true);
    this.patchBusiness({
      payload: this.patchPayload,
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
        this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.representative });
        this.formLoading.emit(false)
      }
    });
  }

  render() {
    if (!this.formController || this.isLoading) {
      return (
        <PaymentProvisioningLoading />
      );
    }

    return (
      <justifi-business-representative-form-inputs
        representativeDefaultValue={this.formController.getInitialValues()}
        errors={this.errors}
        formController={this.formController}
        country={this.country}
      />
    );
  }
};
