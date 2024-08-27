import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { Identity, Representative } from '../../../../api/Identity';
import { parseIdentityInfo } from '../../utils/payload-parsers';
import { FormController } from '../../../form/form';
import { BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { ComponentError } from '../../../../api/ComponentError';
import { identitySchema } from '../../schemas/business-identity-schema';
import { PHONE_MASKS, SSN_MASK } from '../../../../utils/form-input-masks';
import { deconstructDate } from '../../utils/helpers';

@Component({
  tag: "justifi-business-representative-form-step-core",
})
export class BusinessRepresentativeFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() representative: Identity = {};

  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;

  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event({ bubbles: true }) formLoading: EventEmitter<boolean>;
  @Event({ eventName: "error-event", bubbles: true }) errorEvent: EventEmitter<ComponentError>;

  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  }

  get patchPayload() {
    let formValues = parseIdentityInfo(this.formController.values.getValue());
    return JSON.stringify({ representative: formValues });
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

  onAddressFormUpdate = (values: any): void => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      address: {
        ...this.formController.values.getValue().address,
        ...values,
      }
    });
  }

  onDateOfBirthUpdate = (event): void => {
    if (event.detail === '') {
      this.formController.setValues({
        ...this.formController.values.getValue(),
        dob_day: null,
        dob_month: null,
        dob_year: null,
      });
    } else {
      const dob_values = deconstructDate(event.detail);
      this.formController.setValues({
        ...this.formController.values.getValue(),
        dob_day: dob_values.dob_day,
        dob_month: dob_values.dob_month,
        dob_year: dob_values.dob_year,
      });
    }
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

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  render() {
    const representativeDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts='label,input,input-invalid'>
        <form>
          <fieldset>
            <legend>Representative</legend>
            <hr />
            <div class='row gy-3'>
              <div class='col-12 col-md-8'>
                <form-control-text
                  name='name'
                  label='Full Name'
                  defaultValue={representativeDefaultValue?.name}
                  errorText={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-4'>
                <form-control-text
                  name='title'
                  label='Title'
                  defaultValue={representativeDefaultValue?.title}
                  errorText={this.errors.title}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-text
                  name='email'
                  label='Email Address'
                  defaultValue={representativeDefaultValue?.email}
                  errorText={this.errors.email}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class='col-12 col-md-6'>
                <form-control-number-masked
                  name='phone'
                  label='Phone Number'
                  defaultValue={representativeDefaultValue?.phone}
                  errorText={this.errors.phone}
                  inputHandler={this.inputHandler}
                  mask={PHONE_MASKS.US}
                />
              </div>
              <div class='col-12 col-md-4'>
                <form-control-date
                  name='dob_full'
                  label='Birth Date'
                  defaultValue={representativeDefaultValue?.dob_full}
                  errorText={this.errors.dob_full}
                  inputHandler={this.inputHandler}
                  onFormControlInput={this.onDateOfBirthUpdate}
                />
              </div>
              <div class='col-12 col-md-8'>
                <form-control-number-masked
                  name='identification_number'
                  label='SSN'
                  defaultValue={representativeDefaultValue?.identification_number}
                  errorText={this.errors.identification_number}
                  inputHandler={this.inputHandler}
                  mask={SSN_MASK}
                />
              </div>
              <div class='col-12'>
                <justifi-identity-address-form
                  errors={this.errors.address}
                  defaultValues={representativeDefaultValue?.address}
                  handleFormUpdate={this.onAddressFormUpdate}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}