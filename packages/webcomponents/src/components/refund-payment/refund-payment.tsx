import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
  // Method
} from '@stencil/core';
import RefundPaymentSchema from './refund-payment-schema';
import { ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity, ComponentSubmitEvent } from '../../api';
import { FormController } from '../../ui-components/form/form';
import { Button, StyledHost } from '../../ui-components';
import { formatCurrency } from '../../utils/utils';
import refundReasonOptions from './refund-reason-options';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPaymentDetails } from '../../actions/payment/get-payment-details';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { makePostRefund } from '../../actions/refund/refund-actions';
import { RefundService } from '../../api/services/refund.service';

@Component({
  tag: 'justifi-refund-payment',
  shadow: true,
})
export class RefundPayment {
  @State() formController: FormController;
  @State() displayAmount: string = '';
  @State() errors: any = {};
  @State() isLoading: boolean = true;
  @State() submitDisabled: boolean;
  
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() paymentId: string;
  @Prop() hideSubmitButton?: boolean = false;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeFormController();
    this.initializeApi();
  }

  componentDidLoad() {
    console.log('RefundPayment component loaded');
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  private handleError(code: ComponentErrorCodes, errorMessage: string, severity: ComponentErrorSeverity) {
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  private checkAmount(amount: number) {
    return amount > 0;
  }

  private initializeFormController(amount?: number) {
    const amountRefundable = amount ? amount.toString() : '0';
    this.formController = new FormController(RefundPaymentSchema(amountRefundable));
    this.formController.setInitialValues({
      amount: amountRefundable
    });
  }

  inputHandler = (name: string, value: string) => {
    if (name === 'amount') {
      this.displayAmount = value;
    }
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  private initializeApi() {
    if (this.paymentId && this.authToken) {
      const getPayment = makeGetPaymentDetails({
        id: this.paymentId,
        authToken: this.authToken,
        service: new PaymentService(),
      });

      let amount;
      
      getPayment({
        onSuccess: ({ payment }) => {
          amount = payment.amount_refundable;
        },
        onError: ({ error, code, severity }) => {
          this.handleError(code, error, severity);
        },
        final: () => {
          const validAmount = this.checkAmount(amount);
          if (!validAmount) {
            this.submitDisabled = true;
            const errorMessage = 'Refund amount must be greater than 0';
            this.handleError(ComponentErrorCodes.INVALID_REFUND_AMOUNT, errorMessage, ComponentErrorSeverity.ERROR);
          } else {
            this.initializeFormController(amount);
          }
          this.isLoading = false;
        }
      })
    } else {
      const errorMessage = 'Payment ID and Auth Token are required';
      this.handleError(ComponentErrorCodes.MISSING_PROPS, errorMessage, ComponentErrorSeverity.ERROR);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.formController.validateAndSubmit((values) => this.submitRefund(values));
  }

  async submitRefund(values) {
    const postRefund = makePostRefund({
      authToken: this.authToken,
      accountId: this.accountId,
      paymentId: this.paymentId,
      service: new RefundService(),
    });
    this.isLoading = true;

    postRefund({
      refundBody: values,
      onSuccess: ({ response }) => {
        this.submitEvent.emit({ response: response });
      },
      onError: ({ error, code, severity }) => {
        this.handleError(error, code, severity);
      },
      final: () => {
        this.isLoading = false;
      }
    })
  }
  
  render() {
    const defaultValues = this.formController.getInitialValues();

    return (
      <StyledHost>
        <form>
          <div class="row gy-3">
            <div class="col-12">
              <form-control-monetary
                name="amount"
                label="Refund Amount"
                defaultValue={defaultValues.amount}
                inputHandler={this.inputHandler}
                errorText={this.errors.amount}
              />
            </div>
            <div class="col-12">
              <form-control-select
                name="reason"
                label="Reason for refund (optional)"
                defaultValue={defaultValues.reason}
                inputHandler={this.inputHandler}
                options={refundReasonOptions}
                errorText={this.errors.reason}
              />
            </div>
            <div class="col-12">
              <form-control-textarea
                name="description"
                label="Note (optional)"
                defaultValue={defaultValues.description}
                inputHandler={this.inputHandler}
                maxLength={250}
                errorText={this.errors.description}
              />
            </div>
            <div class="form-group d-flex flex-row-reverse">
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSubmit.bind(this)}
                isLoading={this.isLoading}
                hidden={this.hideSubmitButton}
                disabled={this.submitDisabled}
              >
                {`Refund ${formatCurrency(+this.displayAmount)}`}
              </Button>
            </div>
          </div>
        </form>
      </StyledHost>
    );
  }
}
