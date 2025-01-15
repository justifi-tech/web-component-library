import { h } from "@stencil/core";
import { Badge, BadgeVariant } from "../../ui-components/badge/badge";

export const MapPaymentStatusToBadge = (status: string) => {
  const statusToBadgeProps = {
    succeeded: {
      variant: BadgeVariant.SUCCESS,
      title: 'This payment was successfully captured',
      text: 'Succeeded',
    },
    authorized: {
      variant: BadgeVariant.PRIMARY,
      title: 'This card payment was authorized, but not captured. It could still succeed or fail.',
      text: 'Authorized',
    },
    pending: {
      variant: BadgeVariant.PRIMARY,
      title: 'This ACH payment was processed, but the funds have not settled. It could still succeed or fail.',
      text: 'Pending',
    },
    achFailed: {
      variant: BadgeVariant.DANGER,
      title: 'The funds couldn\'t be collected for this ACH payment (in addition to the original payment, an ACH return and fee will appear in a payout)',
      text: 'ACH Failed',
    },
    failed: {
      variant: BadgeVariant.DANGER,
      title: 'This card payment did not go through (it will not appear in a payout)',
      text: 'Failed',
    },
    canceled: {
      variant: BadgeVariant.DANGER,
      title: 'This payment was canceled',
      text: 'Canceled',
    },
    disputed: {
      variant: BadgeVariant.WARNING,
      title: 'The account holder disputed this payment. The amount has been returned and a fee assessed.',
      text: 'Disputed',
    },
    fully_refunded: {
      variant: BadgeVariant.SECONDARY,
      title: 'The full amount of this payment has been refunded',
      text: 'Fully Refunded',
    },
    partially_refunded: {
      variant: BadgeVariant.SECONDARY,
      title: 'A portion of this payment has been refunded',
      text: 'Partially Refunded',
    },
  };

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
}
