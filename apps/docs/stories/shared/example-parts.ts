import { extractVersionFromPackage } from './utils';
const packageVersion = extractVersionFromPackage();

export const head = (tag: string) => `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
  <title>${tag}</title>

  <script type="module" src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${packageVersion}/dist/webcomponents/webcomponents.esm.js"></script>
  <script nomodule src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${packageVersion}/dist/webcomponents/webcomponents.js"></script>
</head>`;