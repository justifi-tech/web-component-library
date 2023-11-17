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
        exportParts='detail-empty-state, detail-metadata-title, detail-metadata, detail-section, detail-section-title, 
        detail-section-item-title, detail-section-item-data, detail-head, detail-title, detail-head-info'
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
