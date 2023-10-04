import { Component, Host, h, Prop } from '@stencil/core';
import { ErrorState } from './utils';

interface IEntityProps {
  metadata: any;
}

@Component({
  tag: 'justifi-details',
  styleUrl: './details.scss',
  shadow: true,
})

export class Details {
  @Prop() errorMessage: string;
  @Prop() entity: IEntityProps;

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
            {this.entity?.metadata && Object.keys(this.entity?.metadata).length ?
              <div class="mt-4">
                <h2 part="detail-metadata-title" class="fs-3">Metadata</h2>
                <hr/>
                <pre part="detail-metadata" class="p-2" aria-label="metadata content">
                  <code>
                    {JSON.stringify(this.entity.metadata, null, 2)}
                  </code>
                </pre>
              </div>
              : null
            }
          </main>
        }
      </Host>
    )
  }
}
