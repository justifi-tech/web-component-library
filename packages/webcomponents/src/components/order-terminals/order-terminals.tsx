import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import JustifiAnalytics from "../../api/Analytics";
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { BusinessService } from "../../api/services/business.service";
import { TerminalModel, ComponentErrorEvent } from "../../api";
import { Business } from "../../api/Business";
import { makeGetBusiness } from "../../actions/business/get-business";
import { OrderTerminalsLoading } from "./order-terminals-loading";
import { buttonPrimary, heading4, heading5, text } from "../../styles/parts";
import { TerminalSelectorLoading } from "./terminal-quantity-selector/terminal-quantity-selector-loading";
import { makeGetTerminalModels } from "../../actions/terminal/get-terminal-models";
import { TerminalService } from "../../api/services/terminal.service";
import { TerminalOrder, TerminalOrderType } from "../../api/TerminalOrder";
import { makeOrderTerminals } from "../../actions/terminal/order-terminals";
import { formatPhoneNumber } from "../../utils/utils";

@Component({
  tag: 'justifi-order-terminals',
  shadow: true,
})
export class OrderTerminals {
  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() shipping: boolean = false;
  @Prop() submitButtonText: string = 'Submit Order';

  @State() loading = {
    business: true,
    terminals: true,
  };
  @State() submitting = false;
  @State() error: { message: string; code?: ComponentErrorCodes; severity?: ComponentErrorSeverity } | null = null;
  @State() business: Business;
  @State() terminalModels: TerminalModel[];
  @State() orderLimit: number;
  @State() order: TerminalOrder;
  @State() totalQuantity: number = 0;

  analytics: JustifiAnalytics;

  @Event({
    eventName: 'error-event',
  }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @Event({ eventName: 'submit-event' }) submitted: EventEmitter<any>;

  componentWillLoad() {
    this.order = new TerminalOrder({
      business_id: this.businessId,
      sub_account_id: this.accountId,
      order_type: this.shipping ? TerminalOrderType.boardingShipping : TerminalOrderType.boardingOnly,
    });
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.loadData();
  }

  private handleError(errorMessage: string, code: ComponentErrorCodes, severity: ComponentErrorSeverity) {
    this.error = { message: errorMessage, code, severity };
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  private loadData() {
    if (!this.businessId || !this.authToken) {
      this.handleError("Invalid business id or auth token", ComponentErrorCodes.MISSING_PROPS, ComponentErrorSeverity.ERROR);
      return;
    }

    this.initializeGetBusiness();
    this.initializeGetTerminalModels();
  }

  private initializeGetBusiness() {
    makeGetBusiness({
      id: this.businessId,
      authToken: this.authToken,
      service: new BusinessService()
    })({
      onSuccess: ({ business }) => {
        this.business = new Business(business);
        this.loading.business = false;
      },
      onError: ({ error, code, severity }) => {
        this.handleError(error, code, severity);
        this.loading.business = false;
      }
    });
  }

  private initializeGetTerminalModels() {
    makeGetTerminalModels({
      id: this.accountId,
      authToken: this.authToken,
      service: new TerminalService()
    })({
      onSuccess: ({ terminals, orderLimit }) => {
        this.terminalModels = terminals;
        this.orderLimit = orderLimit;
        this.loading.terminals = false;
      },
      onError: ({ error, code, severity }) => {
        this.handleError(error, code, severity);
        this.loading.terminals = false;
      }
    });
  }

  private submitOrder() {
    const orderTerminals = makeOrderTerminals({
      authToken: this.authToken,
      service: new TerminalService()
    });

    this.submitting = true;

    orderTerminals({
      terminalOrder: this.order.payload,
      onSuccess: ({ data }) => {
        this.submitted.emit(data);
        this.submitting = false;
      },
      onError: ({ error, code, severity }) => {
        this.handleError(error, code, severity);
        this.submitting = false;
      }
    });
  }

  private onSelectedQuantityChange(event) {
    this.order.updateTerminal(event.detail.modelName, event.detail.quantity);
    this.totalQuantity = this.order.totalQuantity;
  }

  private renderLoading() {
    return (
      <div>
        {this.loading.business && <OrderTerminalsLoading />}
        {this.loading.terminals && (
          <div class="mt-5">
            <TerminalSelectorLoading />
            <TerminalSelectorLoading />
            <TerminalSelectorLoading />
          </div>
        )}
      </div>
    );
  }

  private renderBusinessDetails() {
    if (!this.loading.business && this.business) {
      return (
        <div class="d-flex flex-column gap-4 mb-5 pt-5">
          <div class="row">
            <div class="col-12">
              <h2 part={heading4}>{this.business.legal_name}</h2>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <h5 part={heading5}>Representative:</h5>
              <div>
                <div>{this.business?.representative?.name}</div>
                <div>{this.business?.representative?.title}</div>
                <div>{this.business?.representative?.email}</div>
                <div>{formatPhoneNumber(this.business?.representative?.phone)}</div>
              </div>
            </div>
            <div class="col-6">
              <h5 part={heading5}>{this.shipping ? "Shipping Address:" : "Business Address:"}</h5>
              <div>
                {this.business.legal_address.line1}
                {this.business.legal_address.line2 ? `, ${this.business.legal_address.line2}` : ""}
                <br />
                {this.business.legal_address.city}, {this.business.legal_address.state} {this.business.legal_address.postal_code}
              </div>
            </div>
          </div>
        </div >
      );
    }
  }

  private renderTerminals() {
    if (!this.loading.terminals && this.terminalModels) {
      return (
        <div class="d-flex flex-column gap-2 mt-5">
          {this.terminalModels.map((terminal) => (
            <terminal-quantity-selector
              modelName={terminal.model_name}
              description={terminal.description}
              imageUrl={terminal.image_url}
              helpUrl={terminal.help_url}
              limit={this.orderLimit - this.order.totalQuantity}
              onSelectedQuantityChange={this.onSelectedQuantityChange.bind(this)}
            />
          ))}
        </div>
      );
    }
  }

  private renderOrderSection() {
    return (
      <div class="mt-3">
        <div class="text-end">Order limit: {this.orderLimit}</div>

        <div class="d-flex justify-content-end mt-3">
          <button
            class="btn btn-primary submit-btn"
            onClick={this.submitOrder.bind(this)}
            disabled={this.order.totalQuantity === 0 || this.submitting}
            part={buttonPrimary}
          >
            {this.submitting ? 'Submitting...' : this.submitButtonText}
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <StyledHost>
        <div part={text}>
          {this.renderLoading()}
          {this.renderBusinessDetails()}
          {this.renderTerminals()}
          {this.renderOrderSection()}
        </div>
      </StyledHost>
    );
  }
}
