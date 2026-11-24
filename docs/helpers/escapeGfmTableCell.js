/**
 * Make a value safe for a GFM table cell.
 *
 * Two characters break a cell: `|` splits it into extra columns, and a newline
 * ends the row — a cell carrying one truncates the table and dumps every later
 * row into the page as raw pipe text. Multi-line JSDoc on a `@Prop()` reaches
 * here verbatim through `docs.json`, so every whitespace run collapses to a
 * single space. Pipes already escaped with `\` are left alone.
 *
 * The whitespace pattern is a single unambiguous `\s+` on purpose: `\s` matches
 * newlines too, so anything of the shape `\s*\n\s*` can match a run of spaces
 * several ways and backtracks quadratically (CodeQL js/polynomial-redos).
 *
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function escapeGfmTableCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/\s+/g, ' ')
    .replace(/(?<!\\)\|/g, '\\|')
    .trim();
}
