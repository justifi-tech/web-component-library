import { h } from "@stencil/core";
import { Badge, BadgeVariant } from "../../ui-components/badge/badge";

export const MapPayoutStatusToBadge = (status: string) => {
  const statusToBadgeProps = {
    canceled: {
      variant: BadgeVariant.DANGER,
      title: 'Transfer to your bank account failed',
      text: 'Canceled',
    },
    failed: {
      variant: BadgeVariant.DANGER,
      title: 'Transfer to your bank account failed',
      text: 'Failed',
    },
    forwarded: {
      variant: BadgeVariant.SECONDARY,
      title: 'This payout initially failed; the funds have been forwarded to your next successful payout',
      text: 'Forwarded',
    },
    in_transit: {
      variant: BadgeVariant.PRIMARY,
      title: 'Transfer to your bank account has been initiated',
      text: 'In Transit',
    },
    paid: {
      variant: BadgeVariant.SUCCESS,
      title: 'Successfully deposited into your bank account',
      text: 'Paid',
    },
    pending: {
      variant: BadgeVariant.PRIMARY,
      title: 'Batched and scheduled to be transferred',
      text: 'Pending',
    },
    scheduled: {
      variant: BadgeVariant.PRIMARY,
      title: 'Batched and scheduled to be transferred',
      text: 'Scheduled',
    },
    withdrawn: {
      variant: BadgeVariant.SUCCESS,
      title: 'Negative payout balance successfully withdrawn from your bank account',
      text: 'Withdrawn',
    },
  };

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
};
