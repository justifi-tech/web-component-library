import { h } from '@stencil/core';

export const LoadingState = (
  <main part="detail-loading-state" class="p-2 d-flex justify-content-center">
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
    class="p-2 d-flex justify-content-center error-state"
  >
    <div>{errorMessage}</div>
  </main>
);

export const DetailSection = (
  { sectionTitle }: { sectionTitle: string },
  children,
) => (
  <div part="detail-section" class="mt-4">
    <h5 part="detail-section-title">{sectionTitle}</h5>
    <hr />
    <div class="d-flex flex-column justify-content-center gap-2 text-nowrap">
      {children}
    </div>
  </div>
);

export const DetailItem = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) =>
  title && value ? (
    <div class="d-flex gap-2">
      <span part="detail-section-item-title flex-1" class="fw-bold flex-1">
        {title}
      </span>
      <span
        part="detail-section-item-data flex-1"
        class="flex-1"
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
      <h1 class="m-0" part="detail-title">
        {title}
      </h1>
      {badge}
    </div>
    <div part="detail-head-info" class="d-flex flex-row align-items-top">
      {children}
    </div>
  </div>
);
