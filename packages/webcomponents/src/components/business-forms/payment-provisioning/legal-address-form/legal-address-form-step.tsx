import { Component, Method, Prop, State, h, Event, EventEmitter, Watch } from '@stencil/core';
import { makeGetBusiness, makePatchBusiness } from '../payment-provisioning-actions';
import { BusinessService } from '../../../../api/services/business.service';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent, validateRequiredProps } from '../../../../api/ComponentEvents';
import { CountryCode } from '../../../../utils/country-codes';
import { addressSchemaByCountry } from '../../schemas/business-address-schema';
import { FormController } from '../../../../ui-components/form/form';
import { Address, IAddress } from '../../../../api/Business';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormStep } from '../../utils';
import { emitPublic } from '../../../../api/emit-public';

@Component({
  tag: 'legal-address-form-step'
})
export class LegalAddressFormStep {
  @State() getBusiness: Function;
  @State() patchBusiness: Function;
  @State() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress = {};
  @State() isLoading: boolean = false;

  @Prop() authToken!: string;
  @Prop() businessId!: string;
  @Prop() allowOptionalFields?: boolean;
  @Prop() country?: CountryCode;

  @Watch('authToken')
  @Watch('businessId')
  propChanged() {
    this.initializeApi();
  }

  @Event({ eventName: 'justifi-error', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;
  /** @deprecated Listen for `justifi-error`. Removed in the next major. */
  @Event({ eventName: 'error-event', bubbles: true }) errorEventLegacy: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'justifi-form-step-complete', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  /** @deprecated Listen for `justifi-form-step-complete`. Removed in the next major. */
  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEventLegacy: EventEmitter<ComponentFormStepCompleteEvent>;
  @Prop() loadingHandler?: (loading: boolean) => void;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  }

  get patchPayload() {
    const formValues = new Address(this.formController.values.getValue()).payload;
    return { legal_address: formValues };
  }

  componentWillLoad() {
    this.initializeApi();
    const schemaFactory = addressSchemaByCountry[this.country];
    this.formController = new FormController(schemaFactory(this.allowOptionalFields));
    this.getData();
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private initializeApi() {
    if (!validateRequiredProps(this.errorEvent, this.errorEventLegacy, {
      'auth-token': this.authToken,
      'business-id': this.businessId,
    })) {
      return;
    }

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
  }

  private getData = () => {
    if (!this.getBusiness) return;

    this.loadingHandler?.(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        const business = response.data || {};
        const address = new Address(business.legal_address || {});
        this.legal_address = { ...address, country: this.country };
        this.formController.setInitialValues({ ...this.legal_address });
      },
      onError: ({ error, code, severity }) => {
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        this.loadingHandler?.(false);
        this.isLoading = false;
      }
    });
  }

  private sendData = (onSuccess: () => void) => {
    let submittedData;
    this.loadingHandler?.(true);
    this.patchBusiness({
      payload: this.patchPayload,
      onSuccess: (response) => {
        submittedData = response;
        onSuccess();
      },
      onError: ({ error, code, severity }) => {
        submittedData = error;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          message: error,
          errorCode: code,
          severity: severity
        });
      },
      final: () => {
        emitPublic(this.stepCompleteEvent, this.stepCompleteEventLegacy, { response: submittedData, formStep: BusinessFormStep.legalAddress });
        this.loadingHandler?.(false)
      }
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const legalAddressDefaultValue = this.formController?.getInitialValues();

    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Legal Address of your Business</legend>
            <form-control-tooltip helpText="No PO Boxes." />
          </div>
          <hr class="mt-2" />
          <form-address-fields
            country={this.country}
            errors={this.errors}
            defaultValues={legalAddressDefaultValue}
            inputHandler={this.inputHandler}
          />
        </fieldset>
      </form>
    );
  }
}
