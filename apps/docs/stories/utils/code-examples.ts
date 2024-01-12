import { extractWebcomponentsVersion } from './components-json';

export const codeExampleHead = (tag: string) => `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
  <title>${tag}</title>

  <script type="module" src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${extractWebcomponentsVersion()}/dist/webcomponents/webcomponents.esm.js"></script>
  <script nomodule src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${extractWebcomponentsVersion()}/dist/webcomponents/webcomponents.js"></script>
</head>`;