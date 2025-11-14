import { Component, h, Prop, State, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { additionalQuestionsSchema } from '../../schemas/business-additional-questions-schema';
import { FormController } from '../../../../ui-components/form/form';
import { AdditionalQuestions, IAdditionalQuestions } from '../../../../api/Business';
import { ComponentErrorEvent, ComponentFormStepCompleteEvent } from '../../../../api/ComponentEvents';
import { CURRENCY_MASK } from '../../../../utils/form-input-masks';
import { heading2 } from '../../../../styles/parts';
import { PaymentProvisioningLoading } from '../payment-provisioning-loading';
import { BusinessFormStep, businessServiceReceivedOptions } from '../../utils';

@Component({
  tag: 'justifi-additional-questions-form-step-core',
})
export class AdditionalQuestionsFormStepCore {
  @State() formController: FormController;
  @State() errors: any = {};
  @State() additional_questions: IAdditionalQuestions = {};
  @State() recurringPayments: boolean = false;
  @State() isLoading: boolean = false;

  @Watch('additional_questions')
  recurringPaymentsWatcher(newValue: any) {
    if (newValue?.business_recurring_payments === 'Yes') {
      this.recurringPayments = true;
    } else {
      this.recurringPayments = false;
    }
  }

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
  };

  get patchPayload() {
    let formValues = new AdditionalQuestions(this.formController.values.getValue()).payload;
    return { additional_questions: formValues };
  }

  componentWillLoad() {
    this.getBusiness && this.getData();
    this.formController = new FormController(additionalQuestionsSchema(this.allowOptionalFields));
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
        this.additional_questions = new AdditionalQuestions(response.data.additional_questions || {});
        this.formController.setInitialValues({ ...this.additional_questions });
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
        this.stepCompleteEvent.emit({ response: submittedData, formStep: BusinessFormStep.additionalQuestions });
        this.formLoading.emit(false)
      }
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
    this.additional_questions = new AdditionalQuestions({ ...this.formController.values.getValue(), [name]: value });
  }

  render() {
    const additionalQuestionsDefaultValue = this.formController.getInitialValues();

    if (this.isLoading) {
      return <PaymentProvisioningLoading />;
    }

    return (
      <form>
        <fieldset>
          <div class="d-flex align-items-center gap-2">
            <legend class="mb-0" part={heading2}>Additional Questions</legend>
            <form-control-tooltip helpText="This information helps us understand the business and identify and monitor trends to safeguard you and your customers." />
          </div>
          <hr class="mt-2" />
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <form-control-monetary-provisioning
                name="business_revenue"
                label="What is your business’ estimated annual revenue from its primary business activities?"
                inputHandler={this.inputHandler}
                errorText={this.errors?.business_revenue}
                defaultValue={additionalQuestionsDefaultValue?.business_revenue}
                maskOptions={CURRENCY_MASK.WHOLE}
              />
            </div>
            <div class="col-12 col-md-6">
              <form-control-text
                name="business_payment_volume"
                label="What is your business' annual credit card & ACH volume anticipated to process?"
                inputHandler={this.inputHandler}
                errorText={this.errors?.business_payment_volume}
                defaultValue={additionalQuestionsDefaultValue?.business_payment_volume}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="business_when_service_received"
                label="On average, how long after paying will your customers typically receive their goods or services?"
                inputHandler={this.inputHandler}
                errorText={this.errors?.business_when_service_received}
                options={businessServiceReceivedOptions}
                defaultValue={additionalQuestionsDefaultValue?.business_when_service_received}
              />
            </div>
            <div class="col-12">
              <form-control-text
                name="business_other_payment_details"
                label="Is there anything else you would like us to know about how your customers pay the business? (optional)"
                inputHandler={this.inputHandler}
                errorText={this.errors?.business_other_payment_details}
                defaultValue={additionalQuestionsDefaultValue?.business_other_payment_details}
                helpText="My business takes registration payments 60 days before the start of a season."
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
