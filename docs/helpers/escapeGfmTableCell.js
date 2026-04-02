/**
 * Escape `|` for GFM table cells so literal pipes are not parsed as column
 * delimiters. Does not double-escape pipes already preceded by `\`.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function escapeGfmTableCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).replace(/(?<!\\)\|/g, '\\|');
}
