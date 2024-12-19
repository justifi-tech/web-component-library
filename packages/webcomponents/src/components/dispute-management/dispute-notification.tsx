
import { Component, h, Event, EventEmitter, Prop, State } from "@stencil/core";
import { DisputeManagementClickEvents, DisputeManagementClickEventNames, DisputeResponseSubmittedEvent } from "./dispute";
import { Dispute, IDispute } from "../../api/Dispute";
import { formatCurrency } from "../../utils/utils";
import { text } from "../../styles/parts";
import { Skeleton, Button } from "../../ui-components";
import { IApiResponse } from "../../api/Api";
import { makeSubmitDisputeResponse } from "./dispute-response/dispute-response-actions";
import { DisputeService } from "../../api/services/dispute.service";
import { ComponentError } from "../../api/ComponentError";


@Component({
  tag: 'justifi-dispute-notification',
})
export class DisputeNotification {
  @Prop() dispute: Dispute;
  @Prop() authToken: string;
  @Prop() isLoading: boolean;

  @Event({ eventName: 'click-event' }) clickEvent: EventEmitter<DisputeManagementClickEvents>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;
  @Event() submitted: EventEmitter<DisputeResponseSubmittedEvent>;

  @State() submitDisputeResponse: (args: {
    payload: any,
    onSuccess: (disputeResponse: any) => void,
    onError: (disputeResponse: any) => void
  }) => Promise<IApiResponse<IDispute>>;

  acceptDispute() {
    this.submitDisputeResponse({
      payload: { forfeit: true },
      onSuccess: (response) => {
        this.submitted.emit({ data: response });
      },
      onError: ({ error, code, severity }) => {
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
      },
    });
  }

  componentWillLoad() {
    if (this.dispute && this.authToken) {
      this.submitDisputeResponse = makeSubmitDisputeResponse({
        disputeId: this.dispute.id,
        authToken: this.authToken,
        service: new DisputeService()
      });
    }
  }

  initiateRespondToDispute() {
    this.clickEvent.emit({ name: DisputeManagementClickEventNames.respondToDispute });
  }

  render() {
    return (
      <div>
        {this.isLoading && (
          <div style={{ marginBottom: '8px' }}>
            <Skeleton height={'28px'} width={'70%'} styles={{ marginBottom: '16px' }} />
            <Skeleton height={'18px'} styles={{ marginBottom: '8px' }} />
            <Skeleton height={'18px'} styles={{ marginBottom: '8px' }} />
          </div>
        )}

        {this.dispute?.needsResponse && (
          <div part={text}>
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
              <Button variant="secondary" onClick={() => this.acceptDispute()}>Accept dispute</Button>
              <Button variant="primary" onClick={() => this.initiateRespondToDispute()}>Counter dispute</Button>
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
