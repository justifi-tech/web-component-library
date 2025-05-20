import { Component, h, Prop, State, Event, EventEmitter, Method } from "@stencil/core";
import { ComponentErrorEvent } from "../../../api/ComponentEvents";
import { addAttribute, formatCurrency, processHTML, removeAttribute } from "../../../utils/utils";
import { insuranceValues, insuranceErrors, validateInsuranceValues } from "../insurance-state";
import { StyledHost, Header2 } from "../../../ui-components";
import { text, textDanger } from "../../../styles/parts";
import SeasonInterruptionInsuranceLoading from "./season-interruption-insurance-loading";

@Component({
  tag: 'justifi-season-interruption-insurance-core',
  shadow: true,
})
export class SeasonInterruptionInsuranceCore {
  @Prop() checkoutId: string;
  @Prop() getQuote: Function;
  @Prop() toggleCoverage: Function;
  @Prop() primaryIdentityFirstName: string;
  @Prop() primaryIdentityLastName: string;
  @Prop() primaryIdentityState: string;
  @Prop() primaryIdentityPostalCode: string;
  @Prop() primaryIdentityCountry: string;
  @Prop() primaryIdentityEmailAddress: string;
  @Prop() policyAttributesInsurableAmount: number;
  @Prop() policyAttributesStartDate?: string;
  @Prop() policyAttributesEndDate?: string;
  @Prop() coveredIdentityFirstName?: string;
  @Prop() coveredIdentityLastName?: string;

  @State() quote: any;
  @State() isLoading: boolean = true;
  @State() accepted: string | undefined;

  @Event({ eventName: 'insurance-updated' }) insuranceUpdated: EventEmitter;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    return validateInsuranceValues();
  }

  componentWillLoad() {
    if (this.getQuote) {
      this.fetchData();
    }
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
          last_name: this.primaryIdentityLastName,
          postal_code: this.primaryIdentityPostalCode,
          country: this.primaryIdentityCountry
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
        this.quote = quote;
        this.quote.product.description = processHTML(this.quote.product.description, [
          (html) => removeAttribute(html, 'style'),
          (html) => addAttribute(html, 'a', 'part', text)
        ]);
        this.quote.product.legal_disclaimer = processHTML(this.quote.product.legal_disclaimer, [
          (html) => removeAttribute(html, 'style'),
          (html) => addAttribute(html, 'a', 'part', text)
        ]);
        insuranceValues[quote.policy_type] = quote.accepted;
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

  onChangeHandler(_name: string, value: string) {
    this.accepted = value;
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
    if (this.isLoading) return (
      <StyledHost>
        <SeasonInterruptionInsuranceLoading />
      </StyledHost>
    );

    return (
      <StyledHost>
        <div>
          <Header2 text={this.quote?.product.title} class="fs-5 fw-bold pb-3" />
          <small innerHTML={this.quote?.product.description} part={text}></small>
          <form-control-radio
            label={`Accept coverage for ${formatCurrency(this.quote?.total_cents)}`}
            name="opt-in"
            value={'true'}
            checked={this.accepted === 'true'}
            inputHandler={this.onChangeHandler.bind(this)}
            // don't wanna show error message, but need to show the red border
            errorText={this.error ? ' ' : undefined}
          />
          <form-control-radio
            label="Decline coverage"
            name="opt-in"
            value={'false'}
            checked={this.accepted === 'false'}
            inputHandler={this.onChangeHandler.bind(this)}
            errorText={this.error ? ' ' : undefined}
          />
          <div
            class="invalid-feedback"
            style={{ display: this.error ? 'block' : 'none' }}
            part={textDanger}
          >
            Please select an option
          </div>
          <small innerHTML={this.quote?.product.legal_disclaimer} part={text}></small>
        </div >
      </StyledHost>
    );
  }
};
