import { Component, Host, h, Prop } from '@stencil/core';
import { ErrorState } from './utils';

@Component({
  tag: 'justifi-details',
  styleUrl: './details.scss',
  shadow: true,
})

export class Details {
  @Prop() errorMessage: string;

  render() {
    return (
      <Host
        exportParts='detail-loading-spinner,detail-loading-state,detail-empty-state,
        detail-head,detail-title,detail-head-info,detail-head-info-item,
        detail-head-info-item-title,detail-head-info-item-data,detail-metadata,detail-metadata-title,
        detail-section,detail-section-title,detail-section-item-title,detail-section-item-data'
      >
        {
          this.errorMessage ?
            ErrorState(this.errorMessage)
            :
            <main class="p-2">
              <slot name="head-info" />
              <slot name='detail-sections' />
            </main>
        }
      </Host>
    )
  }
}
