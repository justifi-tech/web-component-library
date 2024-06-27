import { Component, h, Host, Prop, State, Event, EventEmitter } from "@stencil/core";
import { ComponentError } from "../../../api/ComponentError";
import { formatCurrency } from "../../../utils/utils";
import { insuranceValues, insuranceErrors } from "../insurance-state";

@Component({
  tag: 'justifi-season-interruption-insurance-core',
  styleUrl: 'season-interruption-insurance-core.scss',
  shadow: true,
})
export class SeasonInterruptionInsuranceCore {
  @Prop() checkoutId: string;
  @Prop() getQuote: Function;
  @Prop() toggleCoverage: Function;
  @Prop() primaryIdentityFirstName: string;
  @Prop() primaryIdentityLastName: string;
  @Prop() primaryIdentityState: string;
  @Prop() primaryIdentityEmailAddress: string;
  @Prop() policyAttributesInsurableAmount: number;
  @Prop() policyAttributesStartDate?: string;
  @Prop() policyAttributesEndDate?: string;
  @Prop() coveredIdentityFirstName?: string;
  @Prop() coveredIdentityLastName?: string;

  @State() quote: any;
  @State() isLoading: boolean = false;
  @State() accepted: boolean | undefined;

  @Event({ eventName: 'insurance-updated' }) insuranceUpdated: EventEmitter;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.fetchData();
  };

  fetchData(): void {
    this.isLoading = true;

    this.getQuote({
      payload: {
        checkout_id: this.checkoutId,
        policy_type: "season_interruption",
        primary_identity: {
          state: this.primaryIdentityState,
          email: this.primaryIdentityEmailAddress,
          first_name: this.primaryIdentityFirstName,
          last_name: this.primaryIdentityLastName
        },
        policy_attributes: {
          insurable_amount: this.policyAttributesInsurableAmount,
          start_date: this.policyAttributesStartDate,
          end_date: this.policyAttributesEndDate,
          covered_identity: {
            first_name: this.coveredIdentityFirstName,
            last_name: this.coveredIdentityLastName
          }
        }
      },
      onSuccess: ({ quote }) => {
        this.quote = quote
        insuranceValues[quote.policy_type] = quote.accepted
        this.isLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.isLoading = false;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  };

  onChangeHandler(event: any) {
    this.accepted = event.target.value;
    insuranceErrors[this.quote.policy_type] = false;
    this.toggleCoverage({
      quoteId: this.quote.id,
      payload: { accepted: this.accepted },
      onSuccess: () => {
        this.insuranceUpdated.emit();
        insuranceValues[this.quote.policy_type] = this.accepted;
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  }

  get error() {
    return insuranceErrors[this.quote?.policy_type];
  }

  render() {
    return (
      <Host>
        {!this.isLoading &&
          <div>
            <h2 class="fs-5 fw-bold pb-3 jfi-header">{this.quote?.product.title}</h2>
            <small innerHTML={this.quote?.product.description}></small>
            <div>
              <input
                id="accept"
                type="radio"
                name="opt-in"
                value="true"
                onChange={(event: any) => this.onChangeHandler(event)}
                class={this.error ? 'form-check-input me-2 is-invalid' : 'form-check-input me-2'}
              />
              <label htmlFor="accept" class="btn btn-outline-primary jfi-btn-radio-label">
                Accept coverage for {formatCurrency(this.quote?.total_cents)}
              </label>
            </div>
            <div>
              <input
                id="decline"
                type="radio"
                name="opt-in"
                value="false"
                onChange={(event: any) => this.onChangeHandler(event)}
                class={this.error ? 'form-check-input me-2 is-invalid' : 'form-check-input me-2'}
              />
              <label htmlFor="decline" class="btn btn-outline-primary jfi-btn-radio-label">
                Decline coverage
              </label>
            </div>
            <div
              class="invalid-feedback"
              style={{ display: this.error ? 'block' : 'none' }}>
              Please select an option
            </div>
            <small innerHTML={this.quote?.product.legal_disclaimer}></small>
          </div>
        }
      </Host>
    );
  }
};
