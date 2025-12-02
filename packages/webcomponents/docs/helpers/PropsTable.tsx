export interface PropsTableRow {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  defaultValue?: string;
}

interface PropsTableProps {
  rows: PropsTableRow[];
  caption?: string;
}

import { getReact } from './ComponentExample';

export const PropsTable = ({ rows, caption }: PropsTableProps) => {
  if (!rows?.length) {
    return null;
  }

  const React = getReact();

  return React.createElement(
    'table',
    { className: 'docs-props-table' },
    caption ? React.createElement('caption', null, caption) : null,
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement('th', { scope: 'col' }, 'Name'),
        React.createElement('th', { scope: 'col' }, 'Type'),
        React.createElement('th', { scope: 'col' }, 'Required'),
        React.createElement('th', { scope: 'col' }, 'Default'),
        React.createElement('th', { scope: 'col' }, 'Description')
      )
    ),
    React.createElement(
      'tbody',
      null,
      rows.map((row) =>
        React.createElement(
          'tr',
          { key: row.name },
          React.createElement('td', null, React.createElement('code', null, row.name)),
          React.createElement('td', null, React.createElement('code', null, row.type)),
          React.createElement('td', null, row.required ? 'Yes' : 'No'),
          React.createElement(
            'td',
            null,
            row.defaultValue ? React.createElement('code', null, row.defaultValue) : '—'
          ),
          React.createElement('td', null, row.description)
        )
      )
    )
  );
};

