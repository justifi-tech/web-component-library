import { Component, Host, Prop, h } from '@stencil/core';
import { DetailItem, DetailSectionTitle } from '../../details/utils';
import { SubAccountIdentity } from '../../../api/SubAccount';
import { formatMediumDate } from '../../../utils/utils';

@Component({
  tag: 'subaccount-representative-details',
  styleUrl: 'subaccount-representative-details.scss',
  shadow: true,
})
export class SubaccountRepresentativeDetails {
  @Prop() data: SubAccountIdentity

  render() {
    return (
      <Host>
        <div class='p-2'>
          <DetailSectionTitle sectionTitle='Representative' />
          <div class="d-table gap-2 w-100">
            <div class="row gy-3">
              <div class="col-12 col-md-6">
                <DetailItem
                  title="Name"
                  value={this.data?.name}
                />
                <DetailItem
                  title="Date of Birth"
                  value={formatMediumDate(
                    new Date(
                      Number(this.data?.dob_year),
                      Number(this.data?.dob_month) - 1,
                      Number(this.data?.dob_day)
                    )
                  )}
                />
                <DetailItem
                  title="Email"
                  value={this.data?.email}
                />
                <DetailItem
                  title="Last 4 SSN Digits"
                  value={this.data?.ssn_last4}
                />
              </div>
              <div class="col-12 col-md-6">
                <DetailItem
                  title="Title"
                  value={this.data?.title}
                />
                <DetailItem
                  title="Phone"
                  value={this.data?.phone}
                />
                <DetailItem
                  title="Representative Address"
                  value={this.data?.address_line1}
                />
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
