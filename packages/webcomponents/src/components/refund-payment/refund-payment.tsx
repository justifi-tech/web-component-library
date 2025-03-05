import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core';
import RefundPaymentSchema, { RefundPaymentFields } from './refund-payment-schema';
import { Api } from '../../api';
import { FormController } from '../../ui-components/form/form';
import { CURRENCY_MASK } from '../../utils/form-input-masks';
import { Header1, StyledHost } from '../../ui-components';

const refundReasonOptions: { label: string, value: string }[] = [
  {
    label: 'Select a reason',
    value: '',
  },
  {
    label: 'No',
    value: 'No',
  }
];

@Component({
  tag: 'justifi-refund-payment',
  shadow: true,
})
export class RefundPayment {
  /**
   * Authentication token required to authorize the refund transaction.
   */
  @Prop() authToken: string;

  /**
   * The unique identifier for the payment to be refunded.
   */
  @Prop() paymentId: string;

  /**
   * The amount of the payment to be refunded.
   */
  @Prop() amount?: number = 0;

  /**
   * Custom text for the submit button. Defaults to 'Submit'.
   */
  @Prop() submitButtonText?: string = 'Submit';

  /**
   * Flag to control the visibility of the submit button.
   */
  @Prop() withButton?: boolean;

  @State() errors: any = {};
  @State() isSubmitting: boolean = false;

  /**
   * Event emitted when the refund form is successfully submitted.
   * The submitted refund fields are passed as the event detail.
   */
  @Event() submitted: EventEmitter<RefundPaymentFields>;

  private formController: FormController;
  private api: any;

  componentWillLoad() {
    this.formController = new FormController(RefundPaymentSchema);
    this.formController.setInitialValues({
      amount: this.amount,
      description: '',
    });
    this.initializeApi();
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  /**
   * Handles the form submission.
   * Prevents the default form action, validates the form, and emits the 'submitted' event.
   */
  async handleSubmit(event: Event) {
    event.preventDefault();

    this.formController.validateAndSubmit(this.submitRefund.bind(this), {
      amount: this.amount,
    });
  }

  /**
   * Submits the refund request to the API.
   */
  private async submitRefund() {
    this.isSubmitting = true;
    const refundFields = this.formController.values.getValue();

    try {
      await this.api.post(`payments/${this.paymentId}/refunds`, refundFields);
      this.submitted.emit(refundFields);
    } catch (error) {
      console.error('Error submitting refund:', error);
      this.submitted.emit(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Handles input changes, updating the refundFields state.
   */
  private handleInput(field: keyof RefundPaymentFields, value: any) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [field]: value,
    });
  }

  /**
   * Initializes the API with the given authentication token.
   * Logs a warning if the auth token is missing.
   */
  private initializeApi() {
    if (!this.authToken) {
      console.warn('Warning: Missing auth-token.');
    }
    this.api = Api({ authToken: this.authToken, apiOrigin: PROXY_API_ORIGIN });
  }

  render() {
    return (
      <StyledHost>
        <Header1 text="Refund Payment" class="fs-5 fw-bold pb-3" />
        <form onSubmit={e => this.handleSubmit(e)} class="d-grid gap-4">
          <div class="form-group">
            <form-control-monetary
              name="amount"
              label="Refund Amount"
              defaultValue={this.amount?.toString() || ''}
              maskOptions={CURRENCY_MASK.DECIMAL}
              inputHandler={(name: keyof RefundPaymentFields, value: any) =>
                this.handleInput(name, value)
              }
              errorText={this.errors.amount}
            ></form-control-monetary>
          </div>
          <div class="form-group">
            <form-control-select
              label="Reason for refund (optional)"
              options={refundReasonOptions}
              name="reason"
              defaultValue={''}>
            </form-control-select>
          </div>
          <div class="form-group">
            <form-control-textarea
              name="description"
              label="Note (optional)"
              inputHandler={(name: keyof RefundPaymentFields, value: any) =>
                this.handleInput(name, value)
              }
              errorText={this.errors.description}
              maxLength={250}
            ></form-control-textarea>
          </div>
          {this.withButton && (
            <div class="form-group d-flex flex-row-reverse">
              <button
                type="submit"
                disabled={!!this.isSubmitting}
                class="btn btn-primary ml-auto"
              >
                {this.submitButtonText}
              </button>
            </div>
          )}
        </form>
      </StyledHost>
    );
  }
}
