import { h } from '@stencil/core';

export const FormControlHelpText = (props: { helpText: string, name: string }) => {
  const { helpText, name } = props;

  if (!helpText) {
    return null;
  }

  return (
    <small class='form-text text-muted' id={`form-help-text-${name}`} part="input-help-text">
      {helpText}
    </small>
  );
}
