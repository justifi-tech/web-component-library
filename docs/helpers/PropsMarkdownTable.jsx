import { markdownTable } from 'markdown-table';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { escapeGfmTableCell } from './escapeGfmTableCell.js';

/**
 * React component that renders a markdown table of component props.
 * @param {Object} props - Component props
 * @param {Array} props.props - Array of prop objects with name, type, required, defaultValue, and description properties
 */
export function PropsMarkdownTable({ props }) {
  if (!props || props.length === 0) {
    return null;
  }

  const tableData = [
    ['Name', 'Type', 'Required', 'Default', 'Description'],
    ...props.map((prop) => [
      `\`${prop.name}\``,
      `\`${prop.type}\``,
      prop.required ? 'Yes' : 'No',
      prop.defaultValue ? `\`${prop.defaultValue}\`` : '—',
      prop.description || '',
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
