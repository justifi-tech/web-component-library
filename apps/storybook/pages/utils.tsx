import React from 'react';
import { Source } from '@storybook/blocks';
import dedent from 'ts-dedent';
import DocsJson from '../docs.json';

const extractVersionFromPackage = () => {
  const packageJson = require('../package.json');
  return packageJson.version;
};

const filterDocsByTag = (tag: string) => {
  return DocsJson.components.filter(comp => tag === comp.tag)[0];
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
            <strong>{part}</strong> {description ? '- '+description : ''}
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

const SummaryElement = ({ title, children }) =>
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

export {
  extractVersionFromPackage,
  filterDocsByTag,
  ExportedParts,
  SummaryElement
};
