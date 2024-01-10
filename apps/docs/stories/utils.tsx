import { Source } from '@storybook/blocks';
import dedent from 'ts-dedent';
import webcomponentsPackageJson from '@justifi/webcomponents/package.json';
import webcomponentsDocsJson from '@justifi/webcomponents/dist/docs.json';

const extractVersionFromPackage = () => {
  return webcomponentsPackageJson.version;
};

const filterDocsByTag = (tag: string) => {
  return webcomponentsDocsJson.components.filter(comp => tag === comp.tag)[0];
};

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

export {
  extractVersionFromPackage,
  filterDocsByTag,
  ExportedParts,
  SummaryElement
};
