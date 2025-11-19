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
      label: 'Overview',
      collapsed: false,
      items: [
        { type: 'doc', id: 'overview/index' },
        { type: 'doc', id: 'guides/index' },
      ],
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Entities & Onboarding',
          collapsed: false,
          items: [
            { type: 'doc', id: 'components/business-details' },
            { type: 'doc', id: 'components/business-form' },
            { type: 'doc', id: 'components/payment-provisioning' },
            { type: 'doc', id: 'components/insurance' },
            { type: 'doc', id: 'components/form' },
            { type: 'doc', id: 'components/config-provider' },
          ],
        },
        {
          type: 'category',
          label: 'Payments',
          collapsed: false,
          items: [
            { type: 'doc', id: 'components/checkout' },
            { type: 'doc', id: 'components/tokenize-payment-method' },
            { type: 'doc', id: 'components/card-form' },
            { type: 'doc', id: 'components/payment-method-options' },
            { type: 'doc', id: 'components/checkouts-list' },
            { type: 'doc', id: 'components/payments-list' },
            { type: 'doc', id: 'components/payment-details' },
            { type: 'doc', id: 'components/payment-transactions-list' },
            { type: 'doc', id: 'components/refund-payment' },
            { type: 'doc', id: 'components/dispute-management' },
          ],
        },
        {
          type: 'category',
          label: 'Modular Checkout',
          collapsed: true,
          items: [
            { type: 'doc', id: 'components/modular-checkout' },
            { type: 'doc', id: 'components/modular-checkout-card-form' },
            { type: 'doc', id: 'components/modular-checkout-bank-account-form' },
            { type: 'doc', id: 'components/modular-checkout-apple-pay' },
            { type: 'doc', id: 'components/modular-checkout-plaid-payment-method' },
            { type: 'doc', id: 'components/modular-checkout-sezzle-payment-method' },
            { type: 'doc', id: 'components/modular-checkout-season-interruption-insurance' },
            { type: 'doc', id: 'components/modular-checkout-saved-payment-methods' },
            { type: 'doc', id: 'components/modular-checkout-summary' },
          ],
        },
        {
          type: 'category',
          label: 'Payouts & Reporting',
          collapsed: true,
          items: [
            { type: 'doc', id: 'components/filters' },
            { type: 'doc', id: 'components/payouts-list' },
            { type: 'doc', id: 'components/payout-details' },
            { type: 'doc', id: 'components/payout-transactions-list' },
            { type: 'doc', id: 'components/gross-payment-chart' },
          ],
        },
        {
          type: 'category',
          label: 'Terminals & Hardware',
          collapsed: true,
          items: [
            { type: 'doc', id: 'components/order-terminals' },
            { type: 'doc', id: 'components/terminal-orders-list' },
            { type: 'doc', id: 'components/terminals-list' },
          ],
        },
        {
          type: 'category',
          label: 'Shared Guides',
          collapsed: true,
          items: [{ type: 'doc', id: 'components/index' }],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [{ type: 'doc', id: 'reference/index' }],
    },
  ],
};

export default docsSidebar;
