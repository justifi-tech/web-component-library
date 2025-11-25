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
    { type: 'doc', id: 'introduction/index' },
    { type: 'doc', id: 'changelog/index' },
    {
      type: 'category',
      label: 'Frameworks',
      collapsed: false,
      items: [
        { type: 'doc', id: 'frameworks/index' },
        { type: 'doc', id: 'frameworks/angular/index' },
        { type: 'doc', id: 'frameworks/react/index' },
        { type: 'doc', id: 'frameworks/vue/index' },
      ],
    },
    {
      type: 'category',
      label: 'Modular Checkout',
      collapsed: false,
      items: [
        { type: 'doc', id: 'modular-checkout/index' },
        { type: 'doc', id: 'modular-checkout/docs/index' },
        { type: 'doc', id: 'modular-checkout/example/index' },
        { type: 'doc', id: 'modular-checkout/introduction/index' },
        { type: 'doc', id: 'modular-checkout/complete-examples/index' },
        { type: 'doc', id: 'modular-checkout/sub-components/index' },
      ],
    },
    {
      type: 'category',
      label: 'Payment Facilitation',
      collapsed: false,
      items: [
        { type: 'doc', id: 'payment-facilitation/index' },
        { type: 'doc', id: 'payment-facilitation/dispute-management/index' },
        { type: 'doc', id: 'payment-facilitation/refund-payment/index' },
        {
          type: 'doc',
          id: 'payment-facilitation/tokenize-payment-method/index',
        },
        {
          type: 'doc',
          id: 'payment-facilitation/unified-fintech-checkout™/index',
        },
      ],
    },
    {
      type: 'category',
      label: 'Entities',
      collapsed: false,
      items: [
        { type: 'doc', id: 'entities/index' },
        { type: 'doc', id: 'entities/businessdetails/index' },
        { type: 'doc', id: 'entities/businessform/index' },
        { type: 'doc', id: 'entities/payment-provisioning/index' },
      ],
    },
    {
      type: 'category',
      label: 'Merchant Tools',
      collapsed: false,
      items: [
        { type: 'doc', id: 'merchant-tools/index' },
        { type: 'doc', id: 'merchant-tools/checkouts-list/index' },
        { type: 'doc', id: 'merchant-tools/gross-payments-chart/index' },
        { type: 'doc', id: 'merchant-tools/order-terminals/index' },
        { type: 'doc', id: 'merchant-tools/payment-details/index' },
        {
          type: 'doc',
          id: 'merchant-tools/payment-transactions-list/index',
        },
        { type: 'doc', id: 'merchant-tools/payments-list/index' },
        { type: 'doc', id: 'merchant-tools/payout-details/index' },
        {
          type: 'doc',
          id: 'merchant-tools/payout-transactions-list/index',
        },
        { type: 'doc', id: 'merchant-tools/payouts-list/index' },
        {
          type: 'doc',
          id: 'merchant-tools/terminal-orders-list/index',
        },
        { type: 'doc', id: 'merchant-tools/terminals-list/index' },
      ],
    },
  ],
};

export default docsSidebar;
