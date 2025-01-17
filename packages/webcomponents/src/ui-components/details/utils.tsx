import { FunctionalComponent, h } from '@stencil/core';
import { heading1, heading2, text } from '../../styles/parts';

export const ErrorState = (errorMessage: string) => (
  <main
    class="p-4 d-flex justify-content-center text-center"
    style={{ fontSize: '1.2rem' }}
  >
    <p part={text}>{errorMessage}</p>
  </main>
);

export const DetailSectionTitle: FunctionalComponent<{ sectionTitle: string }> = (props) => (
  <h2
    part={heading2}
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
    <div class="d-table-row gap-2">
      <span class="fw-bold d-table-cell px-2" part={text}>
        {title}
      </span>
      <span
        class="flex-1 d-table-cell px-2 text-wrap"
        part={text}>
        {value}
      </span>
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
  <div class={`d-flex flex-column ${classes}`}>
    <span
      class="fw-bold border-1 border-bottom ps-2 pe-2"
      part={heading2}
    >
      {title}
    </span>
    <span class="pt-2 ps-2 pe-2" part={text}>
      {value}
    </span>
  </div>
);

export const EntityHeadInfo = ({ title, slot, badge }, children) => (
  <div slot={slot} class="p-2">
    <div class="d-flex flex-row align-items-center gap-2 mb-2">
      <h1 class="m-0" part={heading1}>
        {title}
      </h1>
      {badge}
    </div>
    <div class="d-flex flex-row align-items-top" part={text}>
      {children}
    </div>
  </div>
);

export const CodeBlock = ({ metadata }: { metadata: {} }) =>
  metadata && Object.keys(metadata).length ? (
    <div class='mt-4'>
      <pre class="p-2" aria-label="metadata content">
        <code>
          {JSON.stringify(metadata, null, 2)}
        </code>
      </pre>
    </div>
  ) : null;
