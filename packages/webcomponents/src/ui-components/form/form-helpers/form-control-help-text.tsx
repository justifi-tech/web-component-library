import { h } from '@stencil/core';
import { text } from '../../../styles/parts';

export const FormControlHelpText = (props: { helpText: string, name: string }) => {
  const { helpText, name } = props;

  if (!helpText) {
    return null;
  }

  return (
    <small class='form-text text-muted' id={`form-help-text-${name}`} part={text}>
      {helpText}
    </small>
  );
}
