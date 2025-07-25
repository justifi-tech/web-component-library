/// <reference path="../jsx.d.ts" />
import { TemplateData } from '../server/jsx-renderer';

export interface BaseTemplateData extends TemplateData {
  bodyClass?: string;
  scripts?: string[];
  styles?: string[];
  headContent?: string;
  bodyContent: string;
}

export function BaseTemplate(data: BaseTemplateData) {
  const {
    title,
    bodyClass = '',
    scripts = [],
    styles = [],
    headContent = '',
    bodyContent
  } = data;

  // Build styles and scripts as HTML strings
  const stylesHtml = styles.map(style => `<link rel="stylesheet" href="${style}" />`).join('');
  const scriptsHtml = scripts.map(script => `<script>${script}</script>`).join('');

  // Return the full HTML as a string
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css" />
        <link rel="stylesheet" href="/styles/example.css" />
        ${stylesHtml}
        ${headContent}
        <script>
          // Initialize live props client
          window.registerLiveComponent = window.registerLiveComponent || function() {};
        </script>
      </head>
      <body class="${bodyClass}">
        ${bodyContent}
        ${scriptsHtml}
      </body>
    </html>
  `;
} 
