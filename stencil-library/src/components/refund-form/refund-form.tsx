import {
  Component,
  Host,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core';
import { ValidationError } from 'yup';
import RefundFormSchema, { RefundFormFields } from './refund-form-schema';
import { Api } from '../../api';

@Component({
  tag: 'justifi-refund-form',
  styleUrl: 'refund-form.scss',
  shadow: true,
})
export class RefundForm {
  @Prop() authToken: string;
  @Prop() paymentId: string;

  @Prop() submitButtonText?: string = 'Submit';
  @Prop() withButton?: boolean;
  @Prop() refundInfoText?: string;

  @State() refundFields: RefundFormFields = { amount: 0, message: '' };
  @State() refundFieldsErrors: any = {};
  @State() isLoading: boolean = false;

  @Event() submitted: EventEmitter<RefundFormFields>;

  private api: any;

  componentWillLoad() {
    this.initializeApi();
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    const validation = await this.validate();

    if (validation.isValid) {
      await this.submitRefund();
      this.submitted.emit(this.refundFields);
    }

    this.isLoading = false;
  }

  private async submitRefund() {
    const response = await this.api.post(
      `payments/${this.paymentId}/refunds`,
      this.refundFields,
    );
    return response;
  }

  private handleInput(field: keyof RefundFormFields, value: any) {
    this.refundFields = { ...this.refundFields, [field]: value };
  }

  private async validate() {
    const newErrors = {};
    let isValid = true;

    try {
      await RefundFormSchema.validate(this.refundFields, { abortEarly: false });
    } catch (err) {
      isValid = false;
      if (err instanceof ValidationError) {
        err.inner.forEach((error: ValidationError) => {
          newErrors[error.path] = error.message;
        });
      }
    }

    this.refundFieldsErrors = newErrors;
    return { isValid };
  }

  private initializeApi() {
    if (!this.authToken) {
      console.warn('Warning: Missing auth-token.');
    }
    this.api = Api(this.authToken, process.env.ENTITIES_API_ORIGIN);
  }

  render() {
    return (
      <Host>
        <h1>Refund</h1>

        {this.refundInfoText && (
          <div class="info-text-container" role="alert">
            <img
              src="/info-icon.svg"
              alt="Information"
              class="info-icon"
              height="30"
              width="30"
            />

            <p class="info-text" innerHTML={this.refundInfoText} />
          </div>
        )}

        <form onSubmit={e => this.handleSubmit(e)} class="d-grid gap-4">
          <div class="form-group">
            <form-control-monetary
              name="amount"
              label="Refund Amount"
              defaultValue={this.refundFields.amount?.toString() || ''}
              inputHandler={(name: keyof RefundFormFields, value: any) =>
                this.handleInput(name, value)
              }
              error={this.refundFieldsErrors.amount}
            ></form-control-monetary>
          </div>
          <div class="form-group">
            <form-control-text
              name="notes"
              label="Additional Notes"
              defaultValue={this.refundFields.message || ''}
              inputHandler={(name: keyof RefundFormFields, value: any) =>
                this.handleInput(name, value)
              }
              error={this.refundFieldsErrors.notes}
            ></form-control-text>
          </div>
          {this.withButton && (
            <div class="form-group d-flex flex-row-reverse">
              <button
                type="submit"
                class={`btn btn-primary ml-auto jfi-submit-button${
                  !!this.isLoading ? ' jfi-submit-button-loading' : ''
                }`}
              >
                {this.submitButtonText}
              </button>
            </div>
          )}
        </form>
      </Host>
    );
  }
}
