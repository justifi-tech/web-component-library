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

const ExportedParts = ({ tags, component }: { tags: string[]; component: string }) => {
  return (
    <ul>
      {tags.map(text => {
        const splitText = text.split(':');
        const part = splitText[0];
        const description = splitText[1];
        return (
          <li key={part}>
            <strong>{part}</strong> - {description}
            <ExportedPartUsage component={component} tag={part} />
          </li>
        );
      })}
    </ul>
  );
};

const ExportedPartUsage = ({ tag, component }: { tag: string; component: string }) => (
  <Source
    dark
    language="css"
    code={dedent(`
      ${component || '*'}::part(${tag}) {
        color: red;
      }
    `)}
  />
);

export { extractVersionFromPackage, filterDocsByTag, ExportedParts };
