export interface SearchItem {
  label: string;
  slug: string;
  category: string;
  description?: string;
}

export const searchData: SearchItem[] = [
  // Components
  { 
    label: "Checkout", 
    slug: "/components/checkout", 
    category: "Components",
    description: "Complete checkout flow component"
  },
  { 
    label: "Tokenize Payment Method", 
    slug: "/components/tokenize-payment-method", 
    category: "Components",
    description: "Securely tokenize payment methods"
  },
  { 
    label: "Business Form", 
    slug: "/components/business-form", 
    category: "Components",
    description: "Business information collection form"
  },
  { 
    label: "Terminals List", 
    slug: "/components/terminals-list", 
    category: "Components",
    description: "Display list of payment terminals"
  },
  { 
    label: "Dispute Management", 
    slug: "/components/dispute-management", 
    category: "Components",
    description: "Handle payment disputes"
  },
  { 
    label: "Checkouts List", 
    slug: "/components/checkouts-list", 
    category: "Components",
    description: "List of checkout sessions"
  },
  { 
    label: "Order Terminals", 
    slug: "/components/order-terminals", 
    category: "Components",
    description: "Order new payment terminals"
  },
  { 
    label: "Refund Payment", 
    slug: "/components/refund-payment", 
    category: "Components",
    description: "Process payment refunds"
  },
  { 
    label: "Payment Provisioning", 
    slug: "/components/payment-provisioning", 
    category: "Components",
    description: "Set up payment processing"
  },
  { 
    label: "Payments List", 
    slug: "/components/payments-list", 
    category: "Components",
    description: "Display payment history"
  },
  { 
    label: "Payment Details", 
    slug: "/components/payment-details", 
    category: "Components",
    description: "Detailed payment information"
  },
  { 
    label: "Payouts List", 
    slug: "/components/payouts-list", 
    category: "Components",
    description: "List of payouts"
  },
  { 
    label: "Payout Details", 
    slug: "/components/payout-details", 
    category: "Components",
    description: "Detailed payout information"
  },
  { 
    label: "Terminal Orders List", 
    slug: "/components/terminal-orders-list", 
    category: "Components",
    description: "List of terminal orders"
  },
  { 
    label: "Season Interruption Insurance", 
    slug: "/components/season-interruption-insurance", 
    category: "Components",
    description: "Insurance management component"
  },
  { 
    label: "Gross Payment Chart", 
    slug: "/components/gross-payment-chart", 
    category: "Components",
    description: "Payment analytics visualization"
  },
  { 
    label: "Business Details", 
    slug: "/components/business-details", 
    category: "Components",
    description: "Business profile management"
  },
  
  // Documentation
  { 
    label: "Getting Started", 
    slug: "/", 
    category: "Documentation",
    description: "Quick start guide"
  },
  { 
    label: "Installation", 
    slug: "/", 
    category: "Documentation",
    description: "Installation instructions"
  },
  { 
    label: "API Reference", 
    slug: "/", 
    category: "Documentation",
    description: "Complete API documentation"
  },
]; 