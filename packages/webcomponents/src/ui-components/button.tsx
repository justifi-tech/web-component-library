import { FunctionalComponent, h } from '@stencil/core';
import { ButtonSpinner } from './button-spinner';
import {
  buttonLoading,
  buttonPrimary,
  buttonSecondary,
  buttonSuccess,
  buttonDanger,
  buttonWarning,
  buttonInfo,
  buttonLight,
  buttonDark,
  buttonLink,
  buttonOutlinePrimary,
  buttonOutlineSecondary,
} from '../styles/parts';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline-primary' | 'outline-secondary';
  isLoading?: boolean;
  className?: string;
}

type ButtonElementProps = ButtonProps & {
  [key: string]: any; // This allows any additional properties
};

export const Button: FunctionalComponent<ButtonElementProps> = (props, children) => {
  const { variant, isLoading, className, class: classProp, clickHandler, ...rest } = props;

  const variantToButton = {
    primary: buttonPrimary,
    secondary: buttonSecondary,
    success: buttonSuccess,
    danger: buttonDanger,
    warning: buttonWarning,
    info: buttonInfo,
    light: buttonLight,
    dark: buttonDark,
    link: buttonLink,
    'outline-primary': buttonOutlinePrimary,
    'outline-secondary': buttonOutlineSecondary,
  };

  const getCSSParts = () => {
    return `${variantToButton[variant]} ${isLoading ? buttonLoading : ''}`;
  };

  const extraClasses = className || classProp || '';
  const computedClass = `btn btn-${variant}${extraClasses ? ` ${extraClasses}` : ''}`;

  return (
    <button
      class={computedClass}
      onClick={clickHandler}
      part={getCSSParts()}
      {...rest}
    >
      {isLoading ? ButtonSpinner() : children}
    </button>
  );
};
