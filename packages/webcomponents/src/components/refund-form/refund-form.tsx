import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core';
import RefundFormSchema, { RefundFormFields } from './refund-form-schema';
import { Api } from '../../api';
import { FormController } from '../../ui-components/form/form';
import { config } from '../../../config';
import { CURRENCY_MASK } from '../../utils/form-input-masks';
import { StyledHost } from '../../ui-components';


@Component({
  tag: 'justifi-refund-form',
  shadow: true,
})
export class RefundForm {
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

  /**
   * Optional information text displayed above the form.
   */
  @Prop() refundInfoText?: string;

  @State() errors: any = {};
  @State() isSubmitting: boolean = false;

  /**
   * Event emitted when the refund form is successfully submitted.
   * The submitted refund fields are passed as the event detail.
   */
  @Event() submitted: EventEmitter<RefundFormFields>;

  private formController: FormController;
  private api: any;

  componentWillLoad() {
    this.formController = new FormController(RefundFormSchema);
    this.formController.setInitialValues({
      amount: this.amount,
      message: '',
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
  private handleInput(field: keyof RefundFormFields, value: any) {
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
    this.api = Api({ authToken: this.authToken, apiOrigin: config.proxyApiOrigin });
  }

  render() {
    return (
      <StyledHost>
        <h1>Refund</h1>

        {this.refundInfoText && (
          <div
            class="d-flex align-items-center flex-row gap-4 border-top border-bottom my-4 p-3"
            role="alert"
          >
            <img
              src="/info-icon.svg"
              alt="Information"
              height="30"
              width="30"
            />

            <p class="m-0" innerHTML={this.refundInfoText} />
          </div>
        )}

        <form onSubmit={e => this.handleSubmit(e)} class="d-grid gap-4">
          <div class="form-group">
            <form-control-monetary
              name="amount"
              label="Refund Amount"
              defaultValue={this.amount?.toString() || ''}
              maskOptions={CURRENCY_MASK.DECIMAL}
              inputHandler={(name: keyof RefundFormFields, value: any) =>
                this.handleInput(name, value)
              }
              errorText={this.errors.amount}
            ></form-control-monetary>
          </div>
          <div class="form-group">
            <form-control-text
              name="notes"
              label="Additional Notes"
              inputHandler={(name: keyof RefundFormFields, value: any) =>
                this.handleInput(name, value)
              }
              errorText={this.errors.notes}
            ></form-control-text>
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
