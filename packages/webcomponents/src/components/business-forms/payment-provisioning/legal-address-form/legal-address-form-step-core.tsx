import { Component, Host, h, Prop, State, Method, Event, EventEmitter } from '@stencil/core';
import { addressSchema } from '../../schemas/business-address-schema';
import { FormController } from '../../../form/form';
import { Address, IAddress } from '../../../../api/Business';
import { BusinessFormSubmitEvent } from '../../utils/business-form-types';
import { ComponentError } from '../../../../api/ComponentError';
import StateOptions from '../../../../utils/state-options';
import { parseAddressInfo } from '../../utils/payload-parsers';
import { numberOnlyHandler } from '../../../form/utils';

@Component({
  tag: 'justifi-legal-address-form-step-core'
})
export class LegalAddressFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() legal_address: IAddress = {};
  
  @Prop() authToken: string;
  @Prop() businessId: string;
  @Prop() getBusiness: Function;
  @Prop() patchBusiness: Function;
  @Prop() allowOptionalFields?: boolean;
  
  @Event({ bubbles: true }) submitted: EventEmitter<BusinessFormSubmitEvent>;
  @Event() formLoading: EventEmitter<boolean>;
  @Event({ eventName: 'error-event', bubbles: true }) errorEvent: EventEmitter<ComponentError>;  
  
  @Method()
  async validateAndSubmit({ onSuccess }) {
    this.formController.validateAndSubmit(() => this.sendData(onSuccess));
  };

  get patchPayload() {
    return parseAddressInfo(this.formController.values.getValue());
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(addressSchema(this.allowOptionalFields));
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
        this.legal_address = new Address(response.data.legal_address || {});
        this.formController.setInitialValues({ ...this.legal_address });      
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
      payload: JSON.stringify({ legal_address: this.patchPayload }),
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
    const legalAddressDefaultValue =
      this.formController.getInitialValues();

    return (
      <Host exportparts="label,input,input-invalid">
        <form>
          <fieldset>
            <legend>Business Legal Address</legend>
            <hr />
            <div class="row gy-3">
              <div class="col-12">
                <form-control-text
                  name="line1"
                  label="Legal Address"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.line1}
                  errorText={this.errors?.line1}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="line2"
                  label="Address Line 2"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.line2}
                  errorText={this.errors?.line2}

                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="city"
                  label="City"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.city}
                  errorText={this.errors?.city}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name="state"
                  label="State"
                  options={StateOptions}
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.state}
                  errorText={this.errors?.state}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name="postal_code"
                  label="Postal Code"
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.postal_code}
                  errorText={this.errors?.postal_code}
                  maxLength={5}
                  keyDownHandler={numberOnlyHandler}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name="country"
                  label="Country"
                  options={[{ label: 'United States', value: 'USA' }]}
                  inputHandler={this.inputHandler}
                  defaultValue={legalAddressDefaultValue?.country}
                  errorText={this.errors?.country}
                  // just for now so we skip handling country specificities
                  disabled={true}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Host>
    );
  }
}
