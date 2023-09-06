import { Component, Host, h, Prop } from '@stencil/core';
import { ErrorState } from './utils';

interface IEntityProps {
  title: string;
  entityHeadInfo: {
    title: string,
    value: any
  }[];
  entitySections: {
    sectionTitle: string;
    sectionDetails: {
      title: string,
      value: any
    }[];
  }[];
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
        detail-head,detail-title,detail-method,detail-info,detail-info-item,
        detail-info-item-title,detail-info-item-data,detail-metadata,detail-metadata-title,
        detail-method-title,detail-method-data'
      >
        {
        this.errorMessage ?
          ErrorState(this.errorMessage)
        :
          <main class="p-2">
            <div part='detail-head' class="p-2">
              <div class="d-flex flex-row align-items-center gap-2 mb-2">
                <h1 class="m-0 text-uppercase" part='detail-title'>{this.entity.title}</h1>
                <slot name="badge" />
              </div>
              <div part="detail-head-info" class="d-flex flex-row align-items-top">
                {
                  this.entity.entityHeadInfo.map((item, index) =>
                    <div part="detail-head-info-item"
                      class={`d-flex flex-column ${index === this.entity.entityHeadInfo.length-1 ? '' : 'border-1 border-end'}`}
                    >
                      <span part="detail-head-info-item-title" class="fw-bold border-1 border-bottom ps-2 pe-2">{item.title}</span>
                      <span part="detail-head-info-item-data" class="pt-2 ps-2 pe-2">{item.value}</span>
                    </div>
                  )
                }
              </div>
            </div>
            {
              this.entity.entitySections.map(section =>
                <div part="detail-details" class="p-2 mt-4">
                  <h2 part="detail-details-title" class="fw-bold fs-1">{section.sectionTitle}</h2>
                  <hr/>
                  <div class="d-flex flex-column justify-content-center gap-2 text-nowrap">
                    {
                      section.sectionDetails.map(item =>
                        !item.value ? null :
                        <div class="d-flex gap-2">
                          <span part="detail-details-item-title" class="fw-bold col-3">{item.title}</span>
                          <span part="detail-details-item-data" innerHTML={item.value}></span>
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            }
            {this.entity?.metadata && Object.keys(this.entity?.metadata).length ?
              <div class="mt-4">
                <h2 part="detail-metadata-title" class="fw-bold fs-5">Metadata</h2>
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
