import {
  Component,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
  Method,
  Watch
} from '@stencil/core';
import RefundPaymentSchema, { RefundPaymentFields } from './refund-payment-schema';
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
  @Prop() authToken: string;
  @Prop() paymentId: string;
  @Prop() hideSubmitButton?: boolean = false;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;

  @State() paymentAmountRefundable: number = 0;
  @State() errors: any = {};
  @State() values: any = {};
  @State() isLoading: boolean = true;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  private formController: FormController;
  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeFormController();
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
    console.log('authToken:', this.authToken);
    console.log('paymentId:', this.paymentId);
    event.preventDefault();
    this.formController.validateAndSubmit(this.submitRefund);
  }

  private handleError(code: ComponentErrorCodes, errorMessage: string, severity: ComponentErrorSeverity) {
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  @Method()
  async submitRefund(values) {
    const postRefund = makePostRefund({
      authToken: this.authToken,
      paymentId: this.paymentId,
      service: new RefundService(),
    });
    this.isLoading = true;

    console.log('Refund values:', values);
    postRefund({
      refundBody: values,
      onSuccess: (response) => {
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

  private handleInput(field: keyof RefundPaymentFields, value: any) {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [field]: value,
    });
  }

  private initializeFormController() {
    this.formController = new FormController(RefundPaymentSchema(this.paymentAmountRefundable.toString()));
  }

  @Watch('paymentAmountRefundable')
  propChanged() {
    this.initializeFormController();
  }

  private initializeApi() {
    if (this.paymentId && this.authToken) {
      const getPayment = makeGetPaymentDetails({
        id: this.paymentId,
        authToken: this.authToken,
        service: new PaymentService(),
      });
      
      getPayment({
        onSuccess: ({ payment }) => {
          this.paymentAmountRefundable = payment.amount_refundable;
          this.isLoading = false;
        },
        onError: ({ error, code, severity }) => {
          this.handleError(code, error, severity);
          this.isLoading = false;
        },
      })

    } else {
      const errorMessage = 'Payment ID and Auth Token are required';
      this.handleError(ComponentErrorCodes.MISSING_PROPS, errorMessage, ComponentErrorSeverity.ERROR);
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
