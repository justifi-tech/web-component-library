import { h } from "@stencil/core";
import { Badge, BadgeVariant } from "../../ui-components/badge/badge";
import { TerminalOrderStatus } from "../../api";

export const MapTerminalOrderStatusToBadge = (status: TerminalOrderStatus) => {
  const statusToBadgeProps = {
    submitted: {
      variant: BadgeVariant.PRIMARY,
      title: 'This order is submitted',
      text: 'Submitted',
    },
    completed: {
      variant: BadgeVariant.SUCCESS,
      title: 'This order has been completed',
      text: 'Completed',
    }
  };

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
}