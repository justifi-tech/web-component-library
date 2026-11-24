/**
 * Make a value safe for a GFM table cell.
 *
 * Two characters break a cell: `|` splits it into extra columns, and a newline
 * ends the row — a cell carrying one truncates the table and dumps every later
 * row into the page as raw pipe text. Multi-line JSDoc on a `@Prop()` reaches
 * here verbatim through `docs.json`, so newlines collapse to a single space.
 * Pipes already escaped with `\` are left alone.
 *
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function escapeGfmTableCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/\s*\r?\n\s*/g, ' ')
    .replace(/(?<!\\)\|/g, '\\|')
    .trim();
}
