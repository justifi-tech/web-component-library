import { Component, h, Host, Prop, State, Event, EventEmitter } from "@stencil/core";
import { ComponentError } from "../../../api/ComponentError";
import { formatCurrency } from "../../../utils/utils";
import { insuranceValues } from "../insurance-state";

@Component({
  tag: 'justifi-season-interruption-insurance-core',
  styleUrl: 'season-interruption-insurance-core.scss',
  shadow: true,
})
export class SeasonInterruptionInsuranceCore {
  @Prop() checkoutId: string;
  @Prop() getQuote: Function;
  @Prop() toggleCoverage: Function;

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
          state: "MN",
          email: "jon.erickson@justifi.tech",
          first_name: "Jon",
          last_name: "Erickson"
        },
        policy_attributes: {
          insurable_amount: 1000,
          start_date: "2024-06-30",
          end_date: "2024-07-31",
          covered_identity: {
            first_name: "Eric",
            last_name: "Erickson"
          }
        }
      },
      onSuccess: ({ quote }) => {
        this.quote = quote
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

  updateInsurance() {
    this.insuranceUpdated.emit();
    insuranceValues['season_interruption'] = this.accepted;
  }

  onChangeHandler(event: any) {
    this.accepted = event.target.value;
    this.toggleCoverage({
      quoteId: this.quote.id,
      payload: { accepted: this.accepted },
      onSuccess: () => {
        this.updateInsurance();
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

  render() {
    return (
      <Host>
        <h2 class="fs-5 fw-bold pb-3 jfi-header">{this.quote?.product.title}</h2>
        <div innerHTML={this.quote?.product.description}></div>

        <div>
          <input
            id="accept"
            type="radio"
            name="opt-in"
            value="true"
            onChange={(event: any) => this.onChangeHandler(event)}
            class="btn-check jfi-btn-radio"
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
            class="btn-check jfi-btn-radio"
          />
          <label htmlFor="decline" class="btn btn-outline-primary jfi-btn-radio-label">
            Decline coverage
          </label>
        </div>
        <div innerHTML={this.quote?.product.legal_disclaimer}></div>
        {/* {insuranceErrors.get('state_interruption') && <div class="alert alert-danger mt-3">Please select an option</div>} */}
      </Host>
    );
  }
};
