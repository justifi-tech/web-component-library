import { Source } from '@storybook/blocks';
import dedent from 'ts-dedent';

export const ExportedParts = ({ tags, component, compact }: { tags: string[]; component: string, compact: boolean }) => {
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

export const ExportedPartUsage = ({ tag, component, compact }: { tag: string; component: string, compact?: boolean }) => (
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

export const SummaryElement = (props: { title: string, children: any }) => {
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
