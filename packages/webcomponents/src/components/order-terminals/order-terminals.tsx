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
import { heading4, listGroup, listGroupItem, text } from "../../styles/parts";

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
        {this.isLoading && <OrderTerminalsLoading />}

        {!this.isLoading && this.errorMessage && ErrorState(this.errorMessage)}

        {!this.isLoading && !this.errorMessage && this.business && (
          <div class="row gap-5 pt-5" part={text}>
            <div class="row">
              <div class="col-12">
                <h2 part={heading4}>Business Information:</h2>
                <p>Business Name: {this.business.legal_name}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <h2 part={heading4}>Representative:</h2>
                <ul class="list-group" part={listGroup}>
                  <li class="list-group-item" part={listGroupItem}>Name: {this.business?.representative?.name}</li>
                  <li class="list-group-item" part={listGroupItem}>Title: {this.business?.representative?.title}</li>
                  <li class="list-group-item" part={listGroupItem}>Email: {this.business?.representative?.email}</li>
                  <li class="list-group-item" part={listGroupItem}>Phone: {this.business?.representative?.phone}</li>
                </ul>
              </div>
              <div class="col-6">
                <h2 part={heading4}>Shipping Address:</h2>
                <ul class="list-group" part={listGroup}>
                  <li class="list-group-item" part={listGroupItem}>Street: {this.business.legal_address?.line1}</li>
                  <li class="list-group-item" part={listGroupItem}>{this.business.legal_address?.line2}</li>
                  <li class="list-group-item" part={listGroupItem}>Postal Code: {this.business.legal_address?.postal_code}</li>
                  <li class="list-group-item" part={listGroupItem}>City: {this.business.legal_address?.city}</li>
                  <li class="list-group-item" part={listGroupItem}>State: {this.business.legal_address?.state}</li>
                </ul>

              </div>
            </div>
          </div>
        )}
      </StyledHost>
    );
  }
}
