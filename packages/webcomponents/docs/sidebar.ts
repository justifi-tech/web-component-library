/*
 * Auto-generated taxonomy that mirrors Storybook's navigation hierarchy.
 * Consumers can import this file directly into Docusaurus sidebars config.
 */

export type SidebarItem =
  | { type: 'doc'; id: string }
  | { type: 'link'; label: string; href: string }
  | { type: 'category'; label: string; items: SidebarItem[]; collapsed?: boolean };

export interface DocsSidebarConfig {
  docs: SidebarItem[];
}

export const docsSidebar: DocsSidebarConfig = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [{ type: 'doc', id: 'overview/introduction' }],
    },
    {
      type: 'category',
      label: 'Frameworks',
      collapsed: false,
      items: [
        { type: 'doc', id: 'frameworks/react' },
        { type: 'doc', id: 'frameworks/angular' },
        { type: 'doc', id: 'frameworks/vue' },
      ],
    },
    {
      type: 'category',
      label: 'Payment Facilitation',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Payments',
          collapsed: true,
          items: [{ type: 'doc', id: 'components/checkout' }],
        },
        { type: 'doc', id: 'components/tokenize-payment-method' },
        { type: 'doc', id: 'components/refund-payment' },
        { type: 'doc', id: 'components/dispute-management' },
      ],
    },
    {
      type: 'category',
      label: 'Entities',
      collapsed: false,
      items: [
        { type: 'doc', id: 'components/business-details' },
        { type: 'doc', id: 'components/business-form' },
        { type: 'doc', id: 'components/payment-provisioning' },
      ],
    },
    {
      type: 'category',
      label: 'Merchant Tools',
      collapsed: false,
      items: [
        { type: 'doc', id: 'components/checkouts-list' },
        { type: 'doc', id: 'components/payments-list' },
        { type: 'doc', id: 'components/payment-details' },
        { type: 'doc', id: 'components/payment-transactions-list' },
        { type: 'doc', id: 'components/payouts-list' },
        { type: 'doc', id: 'components/payout-details' },
        { type: 'doc', id: 'components/payout-transactions-list' },
        { type: 'doc', id: 'components/gross-payment-chart' },
        { type: 'doc', id: 'components/order-terminals' },
        { type: 'doc', id: 'components/terminal-orders-list' },
        { type: 'doc', id: 'components/terminals-list' },
      ],
    },
    {
      type: 'category',
      label: 'Modular Checkout',
      collapsed: false,
      items: [
        { type: 'doc', id: 'components/modular-checkout' },
        {
          type: 'category',
          label: 'Sub-components',
          collapsed: true,
          items: [
            { type: 'doc', id: 'components/modular-checkout-card-form' },
            { type: 'doc', id: 'components/modular-checkout-bank-account-form' },
            { type: 'doc', id: 'components/modular-checkout-plaid-payment-method' },
            { type: 'doc', id: 'components/modular-checkout-sezzle-payment-method' },
            { type: 'doc', id: 'components/modular-checkout-season-interruption-insurance' },
            { type: 'doc', id: 'components/modular-checkout-saved-payment-methods' },
            { type: 'doc', id: 'components/modular-checkout-apple-pay' },
            { type: 'doc', id: 'components/modular-checkout-summary' },
          ],
        },
        {
          type: 'category',
          label: 'Complete Examples',
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'Layout 1',
              href: 'https://storybook.justifi.ai/?path=/docs/modular-checkout-complete-examples-layout-1--docs',
            },
            {
              type: 'link',
              label: 'Layout 2',
              href: 'https://storybook.justifi.ai/?path=/docs/modular-checkout-complete-examples-layout-2--docs',
            },
            {
              type: 'link',
              label: 'Layout 3',
              href: 'https://storybook.justifi.ai/?path=/docs/modular-checkout-complete-examples-layout-3--docs',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Changelog',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'View releases',
          href: 'https://github.com/justifi-tech/web-component-library/blob/main/packages/webcomponents/CHANGELOG.md',
        },
      ],
    },
  ],
};

export default docsSidebar;
