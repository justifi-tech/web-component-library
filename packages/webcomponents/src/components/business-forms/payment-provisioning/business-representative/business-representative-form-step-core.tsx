import { Component, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { Identity, Representative } from '../../../../api/Identity';
import { FormController } from '../../../form/form';
import { BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { ComponentError } from '../../../../api/ComponentError';
import { identitySchema } from '../../schemas/business-identity-schema';

@Component({
  tag: 'justifi-business-representative-form-step-core',
})
export class BusinessRepresentativeFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: Identity = {};

  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ bubbles: true }) formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;

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
      final: () => this.formLoading.emit(false)
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
        this.submitted.emit({ data: { submittedData } });
        this.formLoading.emit(false)
      }
    });
  }

  render() {
    return (
      <justifi-business-representative-form-inputs
        representativeDefaultValue={this.formController.getInitialValues()}
        errors={this.errors}
        formController={this.formController}
      />
    );
  }
};
