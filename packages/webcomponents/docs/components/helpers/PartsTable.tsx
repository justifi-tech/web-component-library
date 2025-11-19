import React from 'react';

export interface PartsTableRow {
  name: string;
  description: string;
  target?: string;
}

interface PartsTableProps {
  parts: PartsTableRow[];
  caption?: string;
}

export const PartsTable: React.FC<PartsTableProps> = ({ parts, caption }) => {
  if (!parts?.length) {
    return null;
  }

  return (
    <table className="docs-parts-table">
      {caption ? <caption>{caption}</caption> : null}
      <thead>
        <tr>
          <th scope="col">Part</th>
          <th scope="col">Description</th>
          <th scope="col">DOM target</th>
        </tr>
      </thead>
      <tbody>
        {parts.map((part) => (
          <tr key={part.name}>
            <td>
              <code>::part({part.name})</code>
            </td>
            <td>{part.description}</td>
            <td>{part.target ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

