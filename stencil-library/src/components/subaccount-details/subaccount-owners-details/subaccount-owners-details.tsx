import { Component, Host, Prop, h } from '@stencil/core';
import { SubAccountIdentity } from '../../../components';
import { DetailItem, DetailSection } from '../../details/utils';

@Component({
  tag: 'subaccount-owners-details',
  styleUrl: 'subaccount-owners-details.scss',
  shadow: true,
})
export class SubaccountOwnersDetails {
  @Prop() data: SubAccountIdentity[]

  render() {
    return (
      <Host>
        <DetailSection sectionTitle='Owners'>
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
        </DetailSection>
      </Host>
    );
  }

}
