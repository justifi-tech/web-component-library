import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { docsSidebar } from '@justifi/webcomponents/docs/sidebar';

const firstCategory = docsSidebar.docs[0];

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: firstCategory?.label ?? 'Sandbox',
      collapsed: false,
      items: ['sandbox'],
    },
  ],
};

export default sidebars;

