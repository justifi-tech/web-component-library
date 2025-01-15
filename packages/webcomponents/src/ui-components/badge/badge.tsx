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
}

type BadgeElementProps = BadgeProps & {
  [key: string]: any; // This allows any additional properties
};

export const Badge: FunctionalComponent<BadgeElementProps> = (props) => {
  const { variant, text } = props;
  const cssClasses = {
    default: 'badge',
    primary: 'badge text-bg-primary',
    secondary: 'badge text-bg-secondary',
    success: 'badge text-bg-success',
    danger: 'badge text-bg-danger',
    warning: 'badge text-bg-warning',
    info: 'badge text-bg-info',
    light: 'badge text-bg-light',
    dark: 'badge text-bg-dark',
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
      {...props}
    >
      {text}
    </span>
  );
};
