import { h } from "@stencil/core";
import { Badge, BadgeVariant } from "../../ui-components/badge/badge";

export const MapCheckoutStatusToBadge = (status: string) => {
  const statusToBadgeProps = {
    created: {
      variant: BadgeVariant.PRIMARY,
      title: 'The checkout has been created',
      text: 'Created',
    },
    completed: {
      variant: BadgeVariant.SUCCESS,
      title: 'The checkout has been completed',
      text: 'Completed',
    },
    attempted: {
      variant: BadgeVariant.SECONDARY,
      title: 'The checkout has been attempted',
      text: 'Attempted',
    },
    expired: {
      variant: BadgeVariant.DANGER,
      title: 'The checkout has expired',
      text: 'Expired',
    },
  }

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
}
