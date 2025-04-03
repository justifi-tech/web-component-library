import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
  Method
} from '@stencil/core';
import RefundPaymentSchema from './refund-payment-schema';
import { ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity, ComponentSubmitEvent, IRefundPayload, RefundPayload } from '../../api';
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
import { RefundLoading } from './refund-loading';

@Component({
  tag: 'justifi-refund-payment',
  shadow: true,
})
export class RefundPayment {
  @State() formController: FormController;
  @State() refundPayload: IRefundPayload = {};
  @State() displayAmount: string = '';
  @State() errors: any = {};
  @State() paymentLoading: boolean = true;
  @State() refundLoading: boolean = false;
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
    this.initializeApi();
    this.formController = new FormController(RefundPaymentSchema());
  }

  private handleError(code: ComponentErrorCodes, errorMessage: string, severity: ComponentErrorSeverity) {
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  private checkAmount(amount: number) {
    return amount > 0;
  }

  private handleInvalidAmount() {
    this.submitDisabled = true;
    const errorMessage = 'Refund amount must be greater than 0';
    this.handleError(ComponentErrorCodes.INVALID_REFUND_AMOUNT, errorMessage, ComponentErrorSeverity.ERROR);
  }

  private initializeFormController() {
    const amount = this.refundPayload.amount;
    const amountRefundable = amount ? amount.toString() : '0';
    this.formController = new FormController(RefundPaymentSchema(amountRefundable));
    
    this.formController.setInitialValues({
      amount: amountRefundable
    });

    this.formController.values.subscribe(values => {
      this.refundPayload = { ...values };
    });

    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: string) => {
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
        apiOrigin: this.apiOrigin
      });
      
      getPayment({
        onSuccess: ({ payment }) => {
          this.refundPayload = new RefundPayload({amount: payment.amount_refundable});
        },
        onError: ({ error, code, severity }) => {
          this.handleError(code, error, severity);
        },
        final: () => {
          const amount = this.refundPayload.amount;
          const validAmount = this.checkAmount(amount);
          !validAmount ? this.handleInvalidAmount() : this.initializeFormController();
          this.paymentLoading = false;
        }
      })
    } else {
      const errorMessage = 'Payment ID and Auth Token are required';
      this.handleError(ComponentErrorCodes.MISSING_PROPS, errorMessage, ComponentErrorSeverity.ERROR);
    }
  }

  @Method()
  async handleSubmit(event) {
    event.preventDefault();
    this.formController.validateAndSubmit(() => this.submitRefund());
  }

  async submitRefund() {
    const postRefund = makePostRefund({
      authToken: this.authToken,
      accountId: this.accountId,
      paymentId: this.paymentId,
      service: new RefundService(),
      apiOrigin: this.apiOrigin
    });
    const values = this.formController.values.getValue();
    this.refundLoading = true;

    let refundResponse;

    postRefund({
      refundBody: values,
      onSuccess: (response) => {
        refundResponse = response;
      },
      onError: ({ error, code, severity }) => {
        refundResponse = error;
        this.handleError(error, code, severity);
      },
      final: () => {
        this.submitEvent.emit({ response: refundResponse });
        this.submitDisabled = true;
        this.refundLoading = false;
      }
    })
  }
  
  render() {
    if (this.paymentLoading) {
      return <RefundLoading />
    }

    const defaultValues = this.formController.getInitialValues();
    const currentRefundAmount = this.refundPayload.amount;

    return (
      <StyledHost>
        <form>
          <fieldset>
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
                  isLoading={this.paymentLoading || this.refundLoading}
                  hidden={this.hideSubmitButton}
                  disabled={this.submitDisabled}
                >
                  {`Refund ${formatCurrency(+currentRefundAmount)}`}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}
