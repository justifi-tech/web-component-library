import { Component, Host, Prop, h } from '@stencil/core';
import { SubAccountIdentity } from '../../../components';
import { DetailItem, DetailSectionTitle } from '../../details/utils';

@Component({
  tag: 'subaccount-owners-details',
})
export class SubaccountOwnersDetails {
  @Prop() data: SubAccountIdentity[]

  render() {
    return (
      <Host>
        <div class='p-2'>
          <DetailSectionTitle sectionTitle='Owners' />
          <div class="d-table gap-2 w-100">
            <div class="row gy-3">
              {this.data && this.data.map((owner) => {
                return (
                  <div class="col-12 col-md-6">
                    <DetailItem
                      title='Owner Name'
                      value={owner.name}
                    />
                    <DetailItem
                      title='Owner Title'
                      value={owner.title}
                    />
                    <DetailItem
                      title='Owner Email'
                      value={owner.email}
                    />
                    <DetailItem
                      title='Owner Phone'
                      value={owner.phone}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
