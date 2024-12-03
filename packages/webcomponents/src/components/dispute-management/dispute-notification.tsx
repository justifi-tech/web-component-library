import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";
import { DisputeManagementClickEvents } from "./dispute";
import { Dispute } from "../../api/Dispute";
import { formatCurrency } from "../../utils/utils";
import { Skeleton } from "../../ui-components";

@Component({
  tag: 'justifi-dispute-notification',
})
export class DisputeNotification {
  @Prop() dispute: Dispute;
  @Prop() isLoading: boolean;

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
        {this.isLoading && (
          <div>
            <Skeleton height={'28px'} styles={{ marginBottom: '16px' }} />
            <Skeleton height={'18px'} styles={{ marginBottom: '8px' }} />
            <Skeleton height={'18px'} styles={{ marginBottom: '8px' }} />
          </div>
        )}

        {this.dispute?.needsResponse && (
          <div>
            <h1 class="h4">This payment is disputed</h1>
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
                  Dispute ID
                </span>
                <span part="detail-section-item-data" class="flex-1 d-table-cell text-wrap">
                  {this.dispute?.id}
                </span>
              </div>
            </div>
            <div class="d-flex gap-2 mt-4 justify-content-end">
              <button class="btn btn-secondary" onClick={() => this.acceptDispute()}>Accept dispute</button>
              <button class="btn btn-primary" onClick={() => this.initiateRespondToDispute()}>Counter dispute</button>
            </div>
          </div>
        )}

        {this.dispute?.underReview && (
          <div>
            <h1 class="h4">This payment is disputed and under review</h1>
            <p>The cardholder is disputing this payment. A counter dispute has been submitted and is under review.</p>
          </div>
        )}

        {this.dispute?.won && (
          <div>Dispute won</div>
        )}

        {this.dispute?.lost && (
          <div>Dispute lost</div>
        )}
      </div>
    );
  }
};
