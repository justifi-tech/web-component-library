import { h } from '@stencil/core';
import { Badge, BadgeVariant } from '../../ui-components/badge/badge';
import { TerminalOrderStatus } from '../../api';

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
    },
    created: {
      variant: BadgeVariant.SECONDARY,
      title: 'This order is created',
      text: 'Created',
    },
    in_progress: {
      variant: BadgeVariant.INFO,
      title: 'This order is in progress',
      text: 'In Progress',
    },
    on_hold: {
      variant: BadgeVariant.WARNING,
      title: 'This order is on hold',
      text: 'On Hold',
    },
    canceled: {
      variant: BadgeVariant.DANGER,
      title: 'This order is canceled',
      text: 'Canceled',
    }
  };

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
}
