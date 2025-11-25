import React from 'react';

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

export const PropsTable: React.FC<PropsTableProps> = ({ rows, caption }) => {
  if (!rows?.length) {
    return null;
  }

  return (
    <table className="docs-props-table">
      {caption ? <caption>{caption}</caption> : null}
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Required</th>
          <th scope="col">Default</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>
              <code>{row.name}</code>
            </td>
            <td>
              <code>{row.type}</code>
            </td>
            <td>{row.required ? 'Yes' : 'No'}</td>
            <td>{row.defaultValue ? <code>{row.defaultValue}</code> : '—'}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

