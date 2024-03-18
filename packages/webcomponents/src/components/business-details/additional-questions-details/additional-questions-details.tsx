import { Component, Host, Prop, h } from '@stencil/core';
import { DetailSectionTitle, DetailItem } from '../../details/utils';
import { AdditionalQuestions } from '../../../api/Business';
import { isEmptyObject } from '../../../utils/utils';

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
  @Prop() additionalQuestions: AdditionalQuestions

  render() {
    if (isEmptyObject(this.additionalQuestions)) return null

    return (
      <Host>
        <DetailSectionTitle sectionTitle="Additional Questions" />
        <div class="d-table gap-2 w-100">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem
                title="Business Revenue"
                value={this.additionalQuestions.business_revenue?.toString()}
              />
              <DetailItem
                title="Business Payment Volume"
                value={this.additionalQuestions.business_payment_volume?.toString()}
              />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem
                title="Business Dispute Volume"
                value={this.additionalQuestions.business_dispute_volume?.toString()}
              />
              <DetailItem
                title="Business Receivable Volume"
                value={this.additionalQuestions.business_receivable_volume?.toString()}
              />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
