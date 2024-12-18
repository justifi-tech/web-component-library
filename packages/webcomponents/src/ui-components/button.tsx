import { FunctionalComponent, h } from '@stencil/core';
import { ButtonSpinner } from './button-spinner';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  isLoading?: boolean;
}

type ButtonElementProps = ButtonProps & {
  [key: string]: any; // This allows any additional properties
};

export const Button: FunctionalComponent<ButtonElementProps> = (props, children) => {
  const classMap = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
  };

  const exportPartMapping = {
    primary: ['button', 'button-primary'],
    secondary: ['button', 'button-secondary'],
  };

  const getCSSParts = () => {
    const baseCSSParts = exportPartMapping[props.variant];
    if (props.isLoading) baseCSSParts.push('button-loading');
    return baseCSSParts.join(' ');
  };

  return (
    <button
      class={classMap[props.variant]}
      onClick={props.clickHandler}
      part={getCSSParts()}
      {...props}
    >
      {props.isLoading ? ButtonSpinner() : children}
    </button>
  );
};
