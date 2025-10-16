import { Component, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../../ui-components/details/utils';
import { formatMediumDate, isEmptyObject } from '../../../utils/utils';
import { Identity } from '../../../api/Identity';

@Component({
  tag: 'representative-details',
})
export class JustifiRepresentativeDetails {
  @Prop() representative: Identity;

  render() {
    if (!this.representative || isEmptyObject(this.representative)) return null;

    return (
      <div>
        <DetailSectionTitle sectionTitle="Representative Details" />
        <div class="d-flex flex-column gap-2 w-100 mt-3">
          <div class="row gy-3">
            <div class="col-12 col-md-6">
              <DetailItem title="Name" value={this.representative?.name} />
              <DetailItem title="ID" value={this.representative?.id} />
              <DetailItem
                title="Address"
                value={this.representative?.address?.line1}
              />
              <DetailItem
                title="Created At"
                value={this.representative?.created_at && formatMediumDate(this.representative?.created_at)}
              />
            </div>
            <div class="col-12 col-md-6">
              <DetailItem title="Title" value={this.representative?.title} />
              <DetailItem
                title="Is Owner?"
                value={this.representative?.is_owner.toString()}
              />
              <DetailItem
                title="Date Of Birth"
                value={this.representative && formatMediumDate(
                  new Date(
                    Number(this.representative?.dob_year),
                    Number(this.representative?.dob_month) - 1,
                    Number(this.representative?.dob_day)
                  ),
                )}
              />
              <DetailItem title="Email" value={this.representative?.email} />
              <DetailItem title="Phone" value={this.representative?.phone} />
              <DetailItem
                title="Updated At"
                value={this.representative && formatMediumDate(this.representative?.updated_at)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
