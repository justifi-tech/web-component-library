import type { Config } from '@docusaurus/types';
import type { Preset } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Docs Consumer Sandbox',
  tagline: 'Validate @justifi/webcomponents docs bundle in Docusaurus',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'justifi-tech',
  projectName: 'docs-consumer',
  trailingSlash: false,
  plugins: [],
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: undefined,
        },
        blog: false,
        pages: {
          path: 'src/pages',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
};

export default config;

