import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import JustifiAnalytics from "../../api/Analytics";
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { BusinessService } from "../../api/services/business.service";
import { ErrorState } from "../../ui-components/details/utils";
import { ComponentErrorEvent } from "../../api";
import { Business } from "../../api/Business";
import { makeGetBusiness } from "../../actions/business/get-business";
import { OrderTerminalsLoading } from "./order-terminals-loading";

@Component({
  tag: 'justifi-order-terminals',
  shadow: true,
})
export class OrderTerminals {
  @Prop() businessId: string;
  @Prop() authToken: string;

  @State() errorMessage: string;
  @State() isLoading: boolean = true;
  @State() business: Business;

  analytics: JustifiAnalytics;

  @Event({
    eventName: 'error-event'
  }) errorEvent: EventEmitter<ComponentErrorEvent>;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetBusiness();
  }

  private initializeGetBusiness() {
    if (!this.businessId || !this.authToken) {
      this.errorMessage = 'Invalid business id or auth token';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    const getBusiness = makeGetBusiness({
      id: this.businessId,
      authToken: this.authToken,
      service: new BusinessService(),
    });

    getBusiness({
      onSuccess: ({ business }) => {
        this.business = new Business(business);
        this.isLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;

        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
        this.isLoading = false;
      }
    });
  }

  render() {
    return (
      <StyledHost>
        {/* Show skeleton loader while loading */}
        {this.isLoading && <OrderTerminalsLoading />}

        {/* Show error message if businessId or authToken is missing */}
        {!this.isLoading && this.errorMessage && ErrorState(this.errorMessage)}

        {/* Show business details if getBusiness is successful */}
        {!this.isLoading && !this.errorMessage && this.business && <p>Business Legal Name: {this.business.legal_name}</p>}
      </StyledHost>
    );
  }
}
