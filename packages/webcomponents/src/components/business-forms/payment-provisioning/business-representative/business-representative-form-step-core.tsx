import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { Identity, Representative } from '../../../../api/Identity';
import { FormController } from '../../../../ui-components/form/form';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { identitySchema } from '../../schemas/business-identity-schema';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormStep } from '../../utils';

@Component({
  tag: 'justifi-business-representative-form-step-core',
})
export class BusinessRepresentativeFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: Identity = {};
  @State() isLoading: boolean = false;

  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ eventName: 'complete-form-step-event', bubbles: true }) stepCompleteEvent: EventEmitter<ComponentFormStepCompleteEvent>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentErrorEvent>;

  // internal loading event
  @Event() formLoading: EventEmitter<boolean>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  }

  get patchPayload() {
    let formValues = new Representative(this.formController.values.getValue()).payload;
    return { representative: formValues };
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(identitySchema('representative', this.allowOptionalFields));
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private getData = () => {
    this.formLoading.emit(true);
    this.isLoading = true;
    this.getBusiness({
      onSuccess: (response) => {
        this.representative = new Representative(response.data.representative || {});
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
        this.stepCompleteEvent.emit({ data: submittedData, formStep: BusinessFormStep.representative });
        this.formLoading.emit(false)
      }
    });
  }

  render() {
    if (this.isLoading) {
      return (
        <PaymentProvisioningLoading />
      );
    }

    return (
      <justifi-business-representative-form-inputs
        representativeDefaultValue={this.formController.getInitialValues()}
        errors={this.errors}
        formController={this.formController}
      />
    );
  }
};
