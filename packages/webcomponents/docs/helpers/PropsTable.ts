export interface PropsTableRow {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  defaultValue?: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function PropsTable(rows: PropsTableRow[], caption?: string): string {
  if (!rows?.length) {
    return '';
  }

  let html = '<table class="docs-props-table">';

  if (caption) {
    html += `<caption>${escapeHtml(caption)}</caption>`;
  }

  html += `
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Type</th>
        <th scope="col">Required</th>
        <th scope="col">Default</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>`;

  for (const row of rows) {
    html += `
      <tr>
        <td>
          <code>${escapeHtml(row.name)}</code>
        </td>
        <td>
          <code>${escapeHtml(row.type)}</code>
        </td>
        <td>${row.required ? 'Yes' : 'No'}</td>
        <td>${row.defaultValue ? `<code>${escapeHtml(row.defaultValue)}</code>` : '—'}</td>
        <td>${escapeHtml(row.description)}</td>
      </tr>`;
  }

  html += `
    </tbody>
  </table>`;

  return html;
}
