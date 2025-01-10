import { FunctionalComponent, h } from '@stencil/core';
// import { badgeSuccess } from '../styles/parts';

interface BadgeProps {
  variant: '';
}

type BadgeElementProps = BadgeProps & {
  [key: string]: any; // This allows any additional properties
};

export const Badge: FunctionalComponent<BadgeElementProps> = (props, children) => {
  const badgeVariant = {
    // success: badgeSuccess,
  };

  const getCSSParts = () => {
    return `${badgeVariant[props.variant]}`;
  };

  return (
    <span
      class={`badge ${props.variant}`}
      part={getCSSParts()}
      {...props}
    >
      {children}
    </span>
  );
};
