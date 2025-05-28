import { Component, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../../ui-components/details/utils';
import { IAdditionalQuestions } from '../../../api/Business';
import { isEmptyObject } from '../../../utils/utils';

@Component({
  tag: 'additional-questions-details',
})
export class AdditionalQuestionsDetails {
  @Prop() additionalQuestions: IAdditionalQuestions

  render() {
    if (!this.additionalQuestions || isEmptyObject(this.additionalQuestions)) return null;

    return (
      <div>
        <DetailSectionTitle sectionTitle="Additional Questions" />
        <div class="d-table gap-2 w-100 mt-3">
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
            {/* <div class="col-12 col-md-6">
              <DetailItem
                title="Business Dispute Volume"
                value={this.additionalQuestions.business_dispute_volume?.toString()}
              />
              <DetailItem
                title="Business Receivable Volume"
                value={this.additionalQuestions.business_receivable_volume?.toString()}
              />
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
