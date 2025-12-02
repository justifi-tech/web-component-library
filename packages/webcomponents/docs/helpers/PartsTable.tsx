export interface PartsTableRow {
  name: string;
  description: string;
  target?: string;
}

interface PartsTableProps {
  parts: PartsTableRow[];
  caption?: string;
}

import { getReact } from './ComponentExample';

export const PartsTable = ({ parts, caption }: PartsTableProps) => {
  if (!parts?.length) {
    return null;
  }

  const React = getReact();

  return React.createElement(
    'table',
    { className: 'docs-parts-table' },
    caption ? React.createElement('caption', null, caption) : null,
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement('th', { scope: 'col' }, 'Part'),
        React.createElement('th', { scope: 'col' }, 'Description'),
        React.createElement('th', { scope: 'col' }, 'DOM target')
      )
    ),
    React.createElement(
      'tbody',
      null,
      parts.map((part) =>
        React.createElement(
          'tr',
          { key: part.name },
          React.createElement('td', null, React.createElement('code', null, `::part(${part.name})`)),
          React.createElement('td', null, part.description),
          React.createElement('td', null, part.target ?? '—')
        )
      )
    )
  );
};

