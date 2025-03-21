import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
  Method,
} from '@stencil/core';
import RefundPaymentSchema, { RefundPaymentFields } from './refund-payment-schema';
import { Api, ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity, ComponentSubmitEvent } from '../../api';
import { FormController } from '../../ui-components/form/form';
import { Button, StyledHost } from '../../ui-components';
import { formatCurrency } from '../../utils/utils';
import refundReasonOptions from './refund-reason-options';

@Component({
  tag: 'justifi-refund-payment',
  shadow: true,
})
export class RefundPayment {
  @Prop() authToken: string;
  @Prop() paymentId: string;
  @Prop() hideSubmitButton?: boolean = false;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;

  @State() paymentAmountRefundable: number = 0;
  @State() errorMessage: string = null;
  @State() errors: any = {};
  @State() values: any = {};
  @State() isLoading: boolean = false;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  private formController: FormController;
  private api: any;

  componentWillLoad() {
    this.formController = new FormController(RefundPaymentSchema(this.paymentAmountRefundable.toString()));
    this.initializeApi();
  }

  componentDidLoad() {
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
    this.formController.values.subscribe(values => {
      this.values = { ...values };
    });
  }


  async handleSubmit(event: Event) {
    event.preventDefault();

    this.formController.validateAndSubmit(this.submitRefund);
  }

  @Method()
  async submitRefund(values) {
    this.isLoading = true;
    let refundResponse: any;

    try {
      refundResponse = await this.api.post(`payments/${this.paymentId}/refunds`, values);
    } catch (error) {
      console.error('Error submitting refund:', error);
      this.errorEvent.emit(error);
    } finally {
      this.submitEvent.emit({ response: refundResponse });
      this.isLoading = false;
    }
  }

  private handleInput(field: keyof RefundPaymentFields, value: any) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [field]: value,
    });
  }

  private initializeApi() {
    if (this.paymentId && this.authToken) {
      this.api = Api({ authToken: this.authToken, apiOrigin: PROXY_API_ORIGIN });
    } else {
      this.errorMessage = 'Payment ID and Auth Token are required';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  render() {
    return (
      <StyledHost>
        <form>
        <div class="row gy-3">
          <div class="form-group">
            <form-control-monetary
              name="amount"
              label="Refund Amount"
              inputHandler={(name: keyof RefundPaymentFields, value: any) =>
                this.handleInput(name, value)
              }
              errorText={this.errors.amount}
              defaultValue={this.paymentAmountRefundable.toString()}
            />
          </div>
          <div class="form-group">
            <form-control-select
              label="Reason for refund (optional)"
              options={refundReasonOptions}
              name="reason"
              defaultValue={''}
            />
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
            />
          </div>
          <div class="form-group d-flex flex-row-reverse">
            <Button
              variant="primary"
              type="submit"
              onClick={e => this.handleSubmit(e)}
              isLoading={this.isLoading}
              hidden={this.hideSubmitButton}
            >
              {`Refund ${formatCurrency(+this.values.amount)}`}
            </Button>
          </div>
        </div>
        </form>
      </StyledHost>
    );
  }
}
