import Link from "next/link";

const components = [
  { label: "Checkout", slug: "checkout" },
  { label: "Tokenize Payment Method", slug: "tokenize-payment-method" },
  { label: "Business Form", slug: "business-form" },
  { label: "Terminals List", slug: "terminals-list" },
  { label: "Dispute Management", slug: "dispute-management" },
  { label: "Checkouts List", slug: "checkouts-list" },
  { label: "Order Terminals", slug: "order-terminals" },
  { label: "Refund Payment", slug: "refund-payment" },
  { label: "Payment Provisioning", slug: "payment-provisioning" },
  { label: "Payments List", slug: "payments-list" },
  { label: "Payment Details", slug: "payment-details" },
  { label: "Payouts List", slug: "payouts-list" },
  { label: "Payout Details", slug: "payout-details" },
  { label: "Terminal Orders List", slug: "terminal-orders-list" },
  { label: "Season Interruption Insurance", slug: "season-interruption-insurance" },
  { label: "Gross Payment Chart", slug: "gross-payment-chart" },
  { label: "Business Details", slug: "business-details" },
];

export default function ComponentsPage() {
  return (
    <div>
      <h1>Components</h1>
      <ul>
        {components.map((comp) => (
          <li key={comp.slug}>
            <Link href={`/components/${comp.slug}`}>{comp.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 