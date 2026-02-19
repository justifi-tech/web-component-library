import { h } from "@stencil/core";
import { Badge, BadgeVariant } from "../../ui-components/badge/badge";
import { ITerminalStatus } from "@api/Terminal";

export const MapTerminalStatusToBadge = (status: ITerminalStatus) => {
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
    pending_configuration: {
      variant: BadgeVariant.WARNING,
      title: 'This terminal is pending configuration',
      text: 'Pending configuration',
    },
    archived: {
      variant: BadgeVariant.SECONDARY,
      title: 'This terminal is archived',
      text: 'Archived',
    }
  }

  const badgeProps = statusToBadgeProps[status];

  return <Badge {...badgeProps} />;
};
