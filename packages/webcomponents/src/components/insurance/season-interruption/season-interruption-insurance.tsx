import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { InsuranceService } from '../../../api/services/insurance.service';
import { makeGetQuote, makeToggleCoverage } from '../insurance-actions';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';

// POST /v1/insurance/quotes/
//
// Generate the quote
//
// {
// 	"checkout_id": "",
// 	"policy_type": "season_interruption",
//   "primary_identity": { 
// 		"state": "MN", 
// 		"email": "jon.erickson@justifi.tech",
// 		"first_name": "Jon", 
// 		"last_name": "Erickson"
// 	},
//   "policy_attributes": {
// 		"insurable_amount": 1000,
// 		"start_date": "2024-05-30", 
// 		"end_date": "2024-05-30",
//     "covered_identity": {
// 			"first_name": "Eric",
// 			"last_name": "Erickson"
// 		}
// 	}
// }

// Quote generate response
//
// {
// 	"id": "",
// 	"type": "array",
// 	"page_info": null,
// 	"data": {
// 		"id": "",
// 		"account_id": "",
// 		"accepted": false,
// 		"checkout_id": "",
// 		"currency": "USD",
// 		"expiration_date": "2024-05-31T00:00:00.000Z",
// 		"mode": "test",
// 		"policy_type": "season_interruption",
// 		"product": {
// 			"title": "Add Registration Protection",
// 			"description": "<p>Protect your registration and get your money back in the event of unforeseen circumstances that prevent participation, including sickness (including COVID-19), injury, inclement weather, transportation, job loss and other covered reasons.</p>",
// 			"legal_disclaimer": "<p>Selecting yes constitutes my electronic signature. I confirm that I have read, understand and agree to the <a href=\"https://partner.battleface.com/library/vertical-insure-season-cancellation-and-interruption\" target=\"_blank\" style=\"color: black\">policy terms and conditions</a>, and <a href=\"https://legal.verticalinsure.com/Vertical-Insure-Disclosures-SPI-Season-Can-and-Int.pdf\" target=\"_blank\" style=\"color: black\">important notices and disclosures</a>, which includes fraud warnings, privacy notice, and consent to electronic signature and delivery.</p>\n\n<p>battleface Travel Insurance plans are underwritten by Spinnaker Insurance Company (an IL Corporation, NAIC# 24376), with administrative office at One Pluckemin Way, Suite 102, Bedminster, NJ 07921. Plans are offered and administered by battleface Insurance Services LLC, 45 East Lincoln Street, Columbus, OH 43215, National Producer Number 18731960 (FL License number L107363/CA License number 0M75381).</p>"
// 		},
// 		"provider": "vertical_insure",
// 		"provider_id": "",
// 		"total_cents": 2000,
// 		"created_at": "2024-05-28T18:55:29.026Z",
// 		"updated_at": "2024-05-28T18:55:29.026Z"
// 	}
// }


@Component({
  tag: 'justifi-season-interruption-insurance',
  shadow: true,
})
export class SeasonInterruptionInsurance {
  @Prop() authToken: string;
  @Prop() checkoutId: string;

  @State() getQuote: Function;
  @State() toggleCoverage: Function;
  @State() quote: any;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.initializeServiceMethods();
  }

  private initializeServiceMethods() {
    if (!this.authToken) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: 'Missing authToken',
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.getQuote = makeGetQuote({
      authToken: this.authToken,
      service: new InsuranceService(),
    });

    this.toggleCoverage = makeToggleCoverage({
      authToken: this.authToken,
      service: new InsuranceService(),
    });
  }

  render() {
    return (
      <justifi-season-interruption-insurance-core
        checkout-id={this.checkoutId}
        getQuote={this.getQuote}
        toggleCoverage={this.toggleCoverage}>
      </justifi-season-interruption-insurance-core>
    );
  }
}
