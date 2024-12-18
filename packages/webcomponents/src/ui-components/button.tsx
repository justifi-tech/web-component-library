import { FunctionalComponent, h } from '@stencil/core';
import { ButtonSpinner } from './button-spinner';
import { buttonLoading, buttonPrimary, buttonSecondary } from '../styles/parts';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  isLoading?: boolean;
}

type ButtonElementProps = ButtonProps & {
  [key: string]: any; // This allows any additional properties
};

export const Button: FunctionalComponent<ButtonElementProps> = (props, children) => {
  const variantToButton = {
    primary: buttonPrimary,
    secondary: buttonSecondary,
  };


  const getCSSParts = () => {
    return `${variantToButton[props.variant]} ${(props.isLoading) ? buttonLoading : ''}`;
  };

  return (
    <button
      class={`btn btn-${props.variant}`}
      onClick={props.clickHandler}
      part={getCSSParts()}
      {...props}
    >
      {props.isLoading ? ButtonSpinner() : children}
    </button>
  );
};
