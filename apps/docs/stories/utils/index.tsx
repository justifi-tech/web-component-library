import { Source } from '@storybook/blocks';
import dedent from 'ts-dedent';
import webcomponentsPackageJson from '@justifi/webcomponents/package.json';
import webcomponentsDocsJson from '@justifi/webcomponents/dist/docs.json';
import CSSVars from './css-variables';
import StoryBaseArgs from './base-args';

const extractVersionFromPackage = () => {
  return webcomponentsPackageJson.version;
};

const filterDocsByTag = (tag: string) => {
  return webcomponentsDocsJson.components.filter(comp => tag === comp.tag)[0];
};

const renderComponentWithStyles = (componentRenderFunc: () => HTMLElement, stylesArg: any) => {
  return (
    <>
      <style>
        {Object.keys(stylesArg).map((style) => {
          const selector = style;
          const styles = stylesArg[style];
          return (
            `
            ${selector} {
              ${Object.keys(styles).map((style) => {
              return `${style}: ${styles[style]};`;
            }).join('')}
          }`
          );
        })}
      </style>
      {componentRenderFunc()}
    </>
  );
}

const ExportedParts = ({ tags, component, compact }: { tags: string[]; component: string, compact: boolean }) => {
  return (
    <ul>
      {tags.map(text => {
        const splitText = text.split(':');
        const part = splitText[0];
        const description = splitText[1];
        return (
          <li key={part}>
            <strong>{part}</strong> {description ? '- ' + description : ''}
            <ExportedPartUsage component={component} tag={part} compact={compact} />
          </li>
        );
      })}
    </ul>
  );
};

const ExportedPartUsage = ({ tag, component, compact }: { tag: string; component: string, compact?: boolean }) => (
  <Source
    dark
    language="css"
    code={dedent(`
      ${component || '*'}::part(${tag}) ${!compact ? `{
        color: red;
      }` : '{}'}
    `)}
  />
);

const SummaryElement = (props: { title: string, children: any }) => {
  const { title, children } = props;

  return (
    <details style={{
      fontFamily: 'var(--bs-font-sans-serif)',
      color: '#2E3438',
      fontSize: '14px',
      cursor: 'pointer'
    }}>
      <summary>
        <b>{title}</b>
      </summary>

      {children}
    </details>
  );
};

const head = (tag: string) => `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
  <title>${tag}</title>

  <script type="module" src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${extractVersionFromPackage()}/dist/webcomponents/webcomponents.esm.js"></script>
  <script nomodule src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${extractVersionFromPackage()}/dist/webcomponents/webcomponents.js"></script>
</head>`;

export {
  head,
  extractVersionFromPackage,
  renderComponentWithStyles,
  filterDocsByTag,
  StoryBaseArgs,
  ExportedParts,
  SummaryElement,
  CSSVars
};
