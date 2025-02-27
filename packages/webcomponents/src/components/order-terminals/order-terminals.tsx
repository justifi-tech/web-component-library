import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import { StyledHost } from "../../ui-components";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import JustifiAnalytics from "../../api/Analytics";
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { BusinessService } from "../../api/services/business.service";
import { ErrorState } from "../../ui-components/details/utils";
import { TerminalModel, ComponentErrorEvent } from "../../api";
import { Business } from "../../api/Business";
import { makeGetBusiness } from "../../actions/business/get-business";
import { OrderTerminalsLoading } from "./order-terminals-loading";
import { buttonPrimary, heading4, inputCheckbox, listGroup, listGroupItem, text } from "../../styles/parts";
import { TerminalSelectorLoading } from "../terminal-quantity-selector/terminal-quantity-selector-loading";
import { makeGetTerminalModels } from "../../actions/terminal/get-terminal-models";
import { TerminalService } from "../../api/services/terminal.service";
import { TerminalOrder, TerminalOrderType } from "../../api/TerminalOrder";
import { makeOrderTerminals } from "../../actions/terminal/order-terminals";

@Component({
  tag: 'justifi-order-terminals',
  shadow: true,
})
export class OrderTerminals {
  @Prop() businessId: string;
  @Prop() authToken: string;
  @Prop() accountId: string;

  @State() errorMessage: string;
  @State() businessIsLoading: boolean = true;
  @State() terminalsIsLoading: boolean = true;
  @State() business: Business;
  @State() terminalModels: TerminalModel[];
  @State() orderLimit: number;
  @State() order: TerminalOrder;
  @State() totalQuantity: number = 0;
  @State() wasClicked: string | boolean = 'no';

  analytics: JustifiAnalytics;

  @Event({
    eventName: 'error-event'
  }) errorEvent: EventEmitter<ComponentErrorEvent>;

  @Event({ eventName: 'submit-event' }) submitted: EventEmitter<any>;

  componentWillLoad() {
    this.order = new TerminalOrder({ business_id: this.businessId, account_id: this.accountId });
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.loadData();
  }

  private loadData() {
    if (!this.businessId || !this.authToken) {
      this.errorMessage = 'Invalid business id or auth token';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    this.initializeGetBusiness();
    this.initializeGetTerminalModels();
  }

  private initializeGetBusiness() {
    const getBusiness = makeGetBusiness({
      id: this.businessId,
      authToken: this.authToken,
      service: new BusinessService(),
    });

    getBusiness({
      onSuccess: ({ business }) => {
        this.business = new Business(business);
        this.businessIsLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;

        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
        this.businessIsLoading = false;
      }
    });
  }

  private initializeGetTerminalModels() {
    const getTerminalModels = makeGetTerminalModels({
      id: this.accountId,
      authToken: this.authToken,
      service: new TerminalService(),
    });

    getTerminalModels({
      onSuccess: ({ terminals, orderLimit }) => {
        this.terminalModels = terminals;
        this.orderLimit = orderLimit;
        this.terminalsIsLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;

        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
        this.terminalsIsLoading = false;
      }
    });
  }

  private submitOrder() {
    const orderTerminals = makeOrderTerminals({
      authToken: this.authToken,
      service: new TerminalService(),
    });

    orderTerminals({
      terminalOrder: this.order.payload,
      onSuccess: ({ data }) => {
        this.submitted.emit(data);
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;

        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  }

  private onSelectedQuantityChange(event) {
    this.order.updateTerminal(event.detail.modelName, event.detail.quantity);
    this.totalQuantity = this.order.totalQuantity;
  }

  render() {
    return (
      <StyledHost>
        {this.businessIsLoading && <OrderTerminalsLoading />}

        {!this.businessIsLoading && this.errorMessage && ErrorState(this.errorMessage)}

        {!this.businessIsLoading && !this.errorMessage && this.business && (
          <div class="gap-5 pt-5" part={text}>
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

        {this.terminalsIsLoading && (
          <div class="mt-5">
            <TerminalSelectorLoading />
            <TerminalSelectorLoading />
            <TerminalSelectorLoading />
          </div>
        )}

        {!this.terminalsIsLoading && this.terminalModels && this.terminalModels.map((terminal) => (
          <terminal-quantity-selector
            modelName={terminal.model_name}
            description={terminal.description}
            imageUrl={terminal.image_url}
            helpUrl={terminal.help_url}
            limit={this.orderLimit - this.order.totalQuantity}
            onSelectedQuantityChange={this.onSelectedQuantityChange.bind(this)}
          />
        ))}

        <div class="form-check d-flex justify-content-end mt-5">
          <form-control-checkbox
            label="Include Shipping"
            name="includeShipping"
            checked={this.order.order_type === TerminalOrderType.boardingShipping}
            inputHandler={(_name, value) => {
              console.log('I WAS CLICKED', value);
              this.wasClicked = value;
              this.order.order_type = value ? TerminalOrderType.boardingShipping : TerminalOrderType.boardingOnly;
            }}
            part={inputCheckbox}
          />
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button
            class="btn btn-primary submit-btn"
            onClick={this.submitOrder.bind(this)}
            disabled={this.order.totalQuantity === 0}
            part={buttonPrimary}
          >
            Order Terminals
          </button>
        </div>
      </StyledHost>
    );
  }
}
