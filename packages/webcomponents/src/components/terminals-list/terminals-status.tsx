import { h } from "@stencil/core";
import { Badge, BadgeVariant } from "../../ui-components/badge/badge";

export const MapTerminalStatusToBadge = (status: string) => {
  const statusToBadgeProps = {
    connected: {
      variant: BadgeVariant.SUCCESS,
      title: 'This terminal is connected',
      text: 'Connected',
    },
    disconnected: {
      variant: BadgeVariant.DANGER,
      title: 'This terminal is disconnected',
      text: 'Disconnected',
    },
    unknown: {
      variant: BadgeVariant.SECONDARY,
      title: 'The status of this terminal is unknown',
      text: 'Unknown',
    },
  }

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
};
