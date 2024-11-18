import { Component, h, Event, EventEmitter } from "@stencil/core";
import { DisputeManagementClickEvents } from "./dispute";

@Component({
  tag: 'justifi-dispute-notification',
})
export class DisputeNotification {
  @Event() submitted: EventEmitter;
  @Event() clickEvent: EventEmitter;

  acceptDispute() {
    // submit the dispute as forfeited, then emit submit event
    this.submitted.emit();
  }

  initiateRespondToDispute() {
    this.clickEvent.emit({ name: DisputeManagementClickEvents.respondToDispute });
  }

  render() {
    return (
      <div>
        <h1 class="h4">This payment was disputed</h1>
        <p>The cardholder for this payment claims that the product was not received.</p>
        <p>You can either counter the dispute by presenting proof of the product's delivery to or use by the cardholder, or you can choose to accept the dispute right away, refund the cardholder, and resolve the matter.</p>

        <h2 class="h5">Dispute details</h2>
        <div class="d-table gap-2">
          <div class="d-table-row gap-2">
            <span part="detail-section-item-title" class="fw-bold d-table-cell pe-4">
              Amount
            </span>
            <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
              $50.00
            </span>
          </div>
          <div class="d-table-row gap-2">
            <span part="detail-section-item-title" class="fw-bold d-table-cell pe-4">
              Reason
            </span>
            <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
              Product not received
            </span>
          </div>
          <div class="d-table-row gap-2">
            <span part="detail-section-item-title" class="fw-bold d-table-cell pe-4">
              Dispute ID
            </span>
            <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
              dis_1234567890
            </span>
          </div>
        </div>
        <div class="d-flex gap-2 mt-4 justify-content-end">
          <button class="btn btn-secondary" onClick={() => this.acceptDispute()}>Accept dispute</button>
          <button class="btn btn-primary" onClick={() => this.initiateRespondToDispute()}>Counter dispute</button>
        </div>
      </div>
    );
  }
};
