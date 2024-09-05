import { FunctionalComponent, h } from '@stencil/core';
import { ButtonSpinner } from '../form/utils';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  type: 'button' | 'submit' | 'reset';
  clickHandler: (e: any) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isHidden?: boolean;
}

export const Button: FunctionalComponent<ButtonProps> = (props, children) => {
  const classMap = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
  };

  const exportPartMapping = {
    primary: ['button', 'button-primary'],
    secondary: ['button', 'button-secondary'],
  };

  const getExportParts = () => {
    const baseExportParts = exportPartMapping[props.variant];
    if (props.isLoading) baseExportParts.push('button-loading');
    return baseExportParts.join(',');
  };

  console.log(props.clickHandler);

  return (
    <button
      type={(props.type) ? props.type : 'button'}
      class={classMap[props.variant]}
      onClick={props.clickHandler}
      disabled={props.isDisabled}
      part={getExportParts()}
      hidden={props.isHidden}
    >
      {props.isLoading ? ButtonSpinner() : children}
    </button>
  );
};