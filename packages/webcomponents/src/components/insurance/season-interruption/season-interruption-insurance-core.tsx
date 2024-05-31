import { Component, h, Host, Prop, State, Event, EventEmitter } from "@stencil/core";
import { ComponentError } from "../../../api/ComponentError";
import { formatCurrency } from "../../../utils/utils";

const quoteResponse = {
  "id": "",
  "type": "array",
  "page_info": null,
  "data": {
    "id": "",
    "account_id": "",
    "accepted": false,
    "checkout_id": "",
    "currency": "USD",
    "expiration_date": "2024-05-31T00:00:00.000Z",
    "mode": "test",
    "policy_type": "season_interruption",
    "product": {
      "title": "Add Registration Protection",
      "description": "<p>Protect your registration and get your money back in the event of unforeseen circumstances that prevent participation, including sickness (including COVID-19), injury, inclement weather, transportation, job loss and other covered reasons.</p>",
      "legal_disclaimer": "<p>Selecting yes constitutes my electronic signature. I confirm that I have read, understand and agree to the <a href=\"https://partner.battleface.com/library/vertical-insure-season-cancellation-and-interruption\" target=\"_blank\" style=\"color: black\">policy terms and conditions</a>, and <a href=\"https://legal.verticalinsure.com/Vertical-Insure-Disclosures-SPI-Season-Can-and-Int.pdf\" target=\"_blank\" style=\"color: black\">important notices and disclosures</a>, which includes fraud warnings, privacy notice, and consent to electronic signature and delivery.</p>\n\n<p>battleface Travel Insurance plans are underwritten by Spinnaker Insurance Company (an IL Corporation, NAIC# 24376), with administrative office at One Pluckemin Way, Suite 102, Bedminster, NJ 07921. Plans are offered and administered by battleface Insurance Services LLC, 45 East Lincoln Street, Columbus, OH 43215, National Producer Number 18731960 (FL License number L107363/CA License number 0M75381).</p>"
    },
    "provider": "vertical_insure",
    "provider_id": "",
    "total_cents": 2000,
    "created_at": "2024-05-28T18:55:29.026Z",
    "updated_at": "2024-05-28T18:55:29.026Z"
  }
}

@Component({
  tag: 'justifi-season-interruption-insurance-core',
  styleUrl: 'season-interruption-insurance-core.scss',
  shadow: true,
})
export class SeasonInterruptionInsuranceCore {
  @Prop() getQuote: Function;

  @State() quote: any;
  @State() isLoading: boolean = false;

  @Event({ eventName: 'insurance-changed' }) insuranceChanged: EventEmitter;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    if (this.getQuote) {
      this.fetchData();
    }
  };

  fetchData(): void {
    this.isLoading = true;
    this.quote = quoteResponse.data;
    console.log(this.quote)
    // this.getQuote({
    //   onSuccess: ({ quote }) => {
    //     this.quote = quote
    //     this.isLoading = false;
    //   },
    //   onError: ({ error, code, severity }) => {
    //     this.isLoading = false;
    //     this.errorEvent.emit({
    //       errorCode: code,
    //       message: error,
    //       severity,
    //     });
    //   }
    // });
  };

  onChangeHandler(event: any) {
    console.log(event.target.value);
    this.insuranceChanged.emit();
    // await accept call
    // emit event to checkout
  }

  render() {
    return (
      <Host>
        <h2 class="fs-5 fw-bold pb-3 jfi-header">{this.quote.product.title}</h2>
        <div innerHTML={this.quote.product.description}></div>

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
            Accept coverage for {formatCurrency(this.quote.total_cents)}
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
        <div innerHTML={this.quote.product.legal_disclaimer}></div>
      </Host>
    );
  }
};