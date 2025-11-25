/*
 * Auto-generated taxonomy that mirrors Storybook's navigation hierarchy.
 * Consumers can import this file directly into Docusaurus sidebars config.
 */

export type SidebarItem =
  | { type: 'doc'; id: string }
  | { type: 'link'; label: string; href: string }
  | {
      type: 'category';
      label: string;
      items: SidebarItem[];
      collapsed?: boolean;
    };

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
          items: [{ type: 'doc', id: 'payment-facilitation/checkout' }],
        },
        { type: 'doc', id: 'payment-facilitation/tokenize-payment-method' },
        { type: 'doc', id: 'payment-facilitation/refund-payment' },
        { type: 'doc', id: 'payment-facilitation/dispute-management' },
      ],
    },
    {
      type: 'category',
      label: 'Entities',
      collapsed: false,
      items: [
        { type: 'doc', id: 'entities/business-details' },
        { type: 'doc', id: 'entities/business-form' },
        { type: 'doc', id: 'entities/payment-provisioning' },
      ],
    },
    {
      type: 'category',
      label: 'Merchant Tools',
      collapsed: false,
      items: [
        { type: 'doc', id: 'merchant-tools/checkouts-list' },
        { type: 'doc', id: 'merchant-tools/payments-list' },
        { type: 'doc', id: 'merchant-tools/payment-details' },
        { type: 'doc', id: 'merchant-tools/payment-transactions-list' },
        { type: 'doc', id: 'merchant-tools/payouts-list' },
        { type: 'doc', id: 'merchant-tools/payout-details' },
        { type: 'doc', id: 'merchant-tools/payout-transactions-list' },
        { type: 'doc', id: 'merchant-tools/gross-payment-chart' },
        { type: 'doc', id: 'merchant-tools/order-terminals' },
        { type: 'doc', id: 'merchant-tools/terminal-orders-list' },
        { type: 'doc', id: 'merchant-tools/terminals-list' },
      ],
    },
    {
      type: 'category',
      label: 'Modular Checkout',
      collapsed: false,
      items: [
        { type: 'doc', id: 'modular-checkout/modular-checkout' },
        {
          type: 'category',
          label: 'Sub-components',
          collapsed: true,
          items: [
            { type: 'doc', id: 'modular-checkout/modular-checkout-card-form' },
            {
              type: 'doc',
              id: 'modular-checkout/modular-checkout-bank-account-form',
            },
            {
              type: 'doc',
              id: 'modular-checkout/modular-checkout-plaid-payment-method',
            },
            {
              type: 'doc',
              id: 'modular-checkout/modular-checkout-sezzle-payment-method',
            },
            {
              type: 'doc',
              id: 'modular-checkout/modular-checkout-season-interruption-insurance',
            },
            {
              type: 'doc',
              id: 'modular-checkout/modular-checkout-saved-payment-methods',
            },
            { type: 'doc', id: 'modular-checkout/modular-checkout-apple-pay' },
            { type: 'doc', id: 'modular-checkout/modular-checkout-summary' },
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
