import { FunctionalComponent, h } from '@stencil/core';

export const LoadingState = () => (
  <main
    part="detail-loading-state"
    class="p-4 d-flex justify-content-center text-center"
    style={{ fontSize: '1.2rem' }}
  >
    <div
      part="detail-loading-spinner"
      class="spinner-border spinner-border-sm"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </main>
);


export const ErrorState = (errorMessage: string) => (
  <main
    part="detail-empty-state"
    class="p-4 d-flex justify-content-center text-center"
    style={{ fontSize: '1.2rem' }}
  >
    <div>{errorMessage}</div>
  </main>
);

export const DetailSectionTitle: FunctionalComponent<{ sectionTitle: string }> = (props) => (
  <h2
    part="header-2"
    class="mt-4 fs-5 border-bottom pb-3"
  >
    {props.sectionTitle}
  </h2>
);

export const DetailItem = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) =>
  title && value ? (
    <div class="d-table-row gap-2" part="detail-section-item">
      <span part="detail-section-item-title" class="fw-bold d-table-cell px-2">
        {title}
      </span>
      <span
        part="detail-section-item-data"
        class="flex-1 d-table-cell px-2 text-wrap"
        innerHTML={value}
      ></span>
    </div>
  ) : null;

export const EntityHeadInfoItem = ({
  title,
  value,
  classes,
}: {
  title: string;
  value: any;
  classes?: string;
}) => (
  <div part="detail-head-info-item" class={`d-flex flex-column ${classes}`}>
    <span
      part="detail-head-info-item-title"
      class="fw-bold border-1 border-bottom ps-2 pe-2"
    >
      {title}
    </span>
    <span part="detail-head-info-item-data" class="pt-2 ps-2 pe-2">
      {value}
    </span>
  </div>
);

export const EntityHeadInfo = ({ title, slot, badge }, children) => (
  <div slot={slot} part="detail-head" class="p-2">
    <div class="d-flex flex-row align-items-center gap-2 mb-2">
      <h1 class="m-0" part="detail-head-amount">
        {title}
      </h1>
      {badge}
    </div>
    <div part="detail-head-info" class="d-flex flex-row align-items-top">
      {children}
    </div>
  </div>
);

export const CodeBlock = ({ metadata }: { metadata: {} }) =>
  metadata && Object.keys(metadata).length ? (
    <div class='mt-4'>
      <pre part="detail-metadata" class="p-2" aria-label="metadata content">
        <code>
          {JSON.stringify(metadata, null, 2)}
        </code>
      </pre>
    </div>
  ) : null;
