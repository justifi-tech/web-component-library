function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * React component that renders a markdown table of component parts.
 * @param {Object} props - Component props
 * @param {Array} props.parts - Array of part objects with name, docs, and target properties
 */
export function PartsMarkdownTable({ parts }) {
  if (!parts || parts.length === 0) {
    return null;
  }

  // Render the markdown table as HTML (similar to PartsTable)
  // Convert markdown table to HTML for rendering
  let html = '<table class="docs-parts-table">';
  html += `
    <thead>
      <tr>
        <th scope="col">Part</th>
        <th scope="col">Description</th>
        <th scope="col">DOM target</th>
      </tr>
    </thead>
    <tbody>`;

  for (const part of parts) {
    html += `
      <tr>
        <td>
          <code>::part(${escapeHtml(part.name)})</code>
        </td>
        <td>${escapeHtml(part.docs || part.description || '')}</td>
        <td>${part.target ? escapeHtml(part.target) : '—'}</td>
      </tr>`;
  }

  html += `
    </tbody>
  </table>`;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
