import { markdownTable } from 'markdown-table';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { escapeGfmTableCell } from './escapeGfmTableCell.js';

/**
 * React component that renders a markdown table of component parts.
 * @param {Object} props - Component props
 * @param {Array} props.parts - Array of part objects with name, docs, and target properties
 */
export function PartsMarkdownTable({ parts }) {
  if (!parts || parts.length === 0) {
    return null;
  }

  const tableData = [
    ['Part', 'Description', 'DOM target'],
    ...parts.map((part) => [
      `\`::part(${part.name})\``,
      part.docs || part.description || '',
      part.target || '—',
    ]),
  ].map((row) => row.map((cell) => escapeGfmTableCell(cell)));

  // Generate markdown table using markdown-table library
  const markdownTableString = markdownTable(tableData);

  // Render the markdown table
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {markdownTableString}
    </ReactMarkdown>
  );
}
