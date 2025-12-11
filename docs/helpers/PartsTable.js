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

export function PartsTable(parts, caption) {
  if (!parts?.length) {
    return '';
  }

  let html = '<table class="docs-parts-table">';

  if (caption) {
    html += `<caption>${escapeHtml(caption)}</caption>`;
  }

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
        <td>${escapeHtml(part.description)}</td>
        <td>${part.target ? escapeHtml(part.target) : '—'}</td>
      </tr>`;
  }

  html += `
    </tbody>
  </table>`;

  return html;
}

