---
"@justifi/webcomponents": patch
---

Fix unreadable tooltip text. Tooltips now default to a light bubble (white background, dark text, subtle border + shadow) instead of dark-on-dark. The tooltip stays themeable via `::part(tooltip)`/`::part(tooltip-inner)` and the shared `color`/`text` parts — themed text color now lands on a light background and stays readable.
