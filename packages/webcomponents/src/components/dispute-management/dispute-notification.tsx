
import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";
import { Dispute } from "../../api/Dispute";
import { formatCurrency } from "../../utils/utils";
import { heading4, text } from "../../styles/parts";
import { Skeleton, Button } from "../../ui-components";
import { makeSubmitDisputeResponse } from "./dispute-response/dispute-response-actions";
import { DisputeService } from "../../api/services/dispute.service";
import { ComponentClickEvent, ComponentSubmitEvent, ComponentErrorEvent } from "../../api/ComponentEvents";
import { DisputeManagementClickActions } from "./event-types";
import { emitPublic } from '../../api/emit-public';

@Component({
  tag: 'dispute-notification',
  shadow: false,
})
export class DisputeNotification {
  @Prop() dispute!: Dispute;
  @Prop() authToken!: string;
  @Prop() isLoading!: boolean;

  @Event({ eventName: 'justifi-click' }) clickEvent: EventEmitter<ComponentClickEvent>;
  /** @deprecated Listen for `justifi-click`. Removed in the next major. */
  @Event({ eventName: 'click-event' }) clickEventLegacy: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'justifi-error' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  /** @deprecated Listen for `justifi-error`. Removed in the next major. */
  @Event({ eventName: 'error-event' }) errorEventLegacy: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'justifi-submit', bubbles: true }) submitEvent: EventEmitter<ComponentSubmitEvent>;
  /** @deprecated Listen for `justifi-submit`. Removed in the next major. */
  @Event({ eventName: 'submit-event', bubbles: true }) submitEventLegacy: EventEmitter<ComponentSubmitEvent>;

  acceptDispute() {
    makeSubmitDisputeResponse({
      disputeId: this.dispute.id,
      authToken: this.authToken,
      service: new DisputeService()
    })({
      payload: { forfeit: true },
      onSuccess: (response) => {
        emitPublic(this.submitEvent, this.submitEventLegacy, { response: response });
      },
      onError: ({ error, code, severity }) => {
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          errorCode: code,
          message: error,
          severity,
        })
      },
    });
  }

  initiateRespondToDispute() {
    emitPublic(this.clickEvent, this.clickEventLegacy, { name: DisputeManagementClickActions.respondToDispute });
  }

  isDueDatePassed(): boolean {
    if (!this.dispute?.due_date) {
      return false;
    }

    // Fix for JavaScript Date object parsing
    // https://stackoverflow.com/a/31732581
    const dueDate = new Date(this.dispute.due_date.replace(/-/g, '/').replace(/T.+/, ''));

    const today = new Date();

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  render() {
    return (
      <div class="dispute-notification-root">
        {this.isLoading && (
          <div style={{ marginBottom: '8px' }}>
            <Skeleton height={'28px'} width={'70%'} styles={{ marginBottom: '16px' }} />
            <Skeleton height={'18px'} styles={{ marginBottom: '8px' }} />
            <Skeleton height={'18px'} styles={{ marginBottom: '8px' }} />
          </div>
        )}

        {this.dispute?.needsResponse && this.isDueDatePassed() && (
          <div part={text}>
            <h1 class="h4" part={heading4}>The due date ({this.dispute?.due_date}) for this dispute has passed</h1>
            <p>You can no longer submit evidence to counter this dispute.</p>
          </div>
        )}

        {this.dispute?.needsResponse && !this.isDueDatePassed() && (
          <div part={text}>
            <h1 class="h4" part={heading4}>This payment is disputed</h1>
            <p>The cardholder is disputing this payment. You may accept this dispute, or proceed to provide evidence in a counter dispute.</p>

            <h2 class="h5">Dispute details</h2>
            <div class="d-table gap-2">
              <div class="d-table-row gap-2">
                <span part="detail-section-item-title" class="fw-bold d-table-cell pe-4">
                  Amount
                </span>
                <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
                  {formatCurrency(this.dispute?.amount)}
                </span>
              </div>
              <div class="d-table-row gap-2">
                <span part="detail-section-item-title" class="fw-bold d-table-cell pe-4">
                  Reason
                </span>
                <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
                  {this.dispute?.reason}
                </span>
              </div>
              <div class="d-table-row gap-2">
                <span part="detail-section-item-title" class="fw-bold d-table-cell pe-4">
                  Due Date
                </span>
                <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
                  {this.dispute?.due_date}
                </span>
              </div>
            </div>
            <div class="d-flex gap-2 mt-4 justify-content-end">
              <Button variant="secondary" onClick={() => this.acceptDispute()}>Accept dispute</Button>
              <Button variant="primary" onClick={() => this.initiateRespondToDispute()}>Counter dispute</Button>
            </div>
          </div>
        )}

        {this.dispute?.underReview && (
          <div part={text}>
            <h1 class="h4" part={heading4}>This payment is disputed and under review</h1>
            <p>The cardholder is disputing this payment. A counter dispute has been submitted and is under review.</p>
          </div>
        )}

        {this.dispute?.won && (
          <div part={text}>
            <h1 class="h4" part={heading4}>This payment was disputed</h1>
            <p>The cardholder disputed this payment and the card issuer has settled it in your favor.</p>
          </div>
        )}

        {this.dispute?.lost && (
          <div part={text}>
            <h1 class="h4" part={heading4}>This payment was disputed</h1>
            <p>The cardholder disputed this payment and the card issuer has settled it in their favor.</p>
          </div>
        )}
      </div>
    );
  }
};
