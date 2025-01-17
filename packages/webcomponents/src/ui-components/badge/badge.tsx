import { FunctionalComponent, h } from '@stencil/core';
import {
  badge,
  badgePrimary,
  badgeSecondary,
  badgeSuccess,
  badgeDanger,
  badgeWarning,
  badgeInfo,
  badgeLight,
  badgeDark,
} from '../../styles/parts';

export enum BadgeVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark',
}

interface BadgeProps {
  variant: BadgeVariant;
  text: string;
  title: string;
}

export const Badge: FunctionalComponent<BadgeProps> = (props) => {
  const { variant, text, title } = props;
  const cssClasses = {
    default: 'badge',
    primary: 'badge bg-primary',
    secondary: 'badge bg-secondary',
    success: 'badge bg-success',
    danger: 'badge bg-danger',
    warning: 'badge bg-warning',
    info: 'badge bg-info',
    light: 'badge bg-light',
    dark: 'badge bg-dark',
  }

  const badgeVariant = {
    default: badge,
    primary: badgePrimary,
    secondary: badgeSecondary,
    success: badgeSuccess,
    danger: badgeDanger,
    warning: badgeWarning,
    info: badgeInfo,
    light: badgeLight,
    dark: badgeDark,
  };

  return (
    <span
      class={cssClasses[variant] || cssClasses.default}
      part={badgeVariant[variant] || badgeVariant.default}
      title={title}
    >
      {text}
    </span>
  );
};
