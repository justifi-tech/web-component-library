import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSection, DetailItem } from '../../details/utils';
import { IBusiness } from '../../../api/Business';

/**
 *
 * @exportedPart detail-section
 * @exportedPart detail-section-title
 * @exportedPart detail-section-item-title
 * @exportedPart detail-section-item-data
 * @exportedPart detail-empty-state
 */
@Component({
  tag: 'additional-questions-details',
  styleUrl: 'additional-questions-details.scss',
  shadow: true,
})
export class AdditionalQuestionsDetails {
  @Prop() business: IBusiness;

  render() {
    return (
      <Host>
        <DetailSection sectionTitle="Additional Questions">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem
                title="Business Revenue"
                value={this.business?.additional_questions.business_revenue?.toString()}
              />
              <DetailItem
                title="Business Payment Volume"
                value={this.business?.additional_questions.business_payment_volume?.toString()}
              />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem
                title="Business Dispute Volume"
                value={this.business?.additional_questions.business_dispute_volume?.toString()}
              />
              <DetailItem
                title="Business Receivable Volume"
                value={this.business?.additional_questions.business_receivable_volume?.toString()}
              />
            </div>
          </div>
        </DetailSection>
      </Host>
    );
  }
}