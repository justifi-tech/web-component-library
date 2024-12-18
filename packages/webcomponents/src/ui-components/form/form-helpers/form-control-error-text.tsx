import { h } from '@stencil/core';
import { textDanger } from '../../../styles/parts';

export const FormControlErrorText = (props: { errorText: string, name: string }) => {
  const { errorText, name } = props;

  if (!errorText) {
    return null;
  }

  return (
    <small class='form-text text-danger' id={`form-error-text-${name}`} part={textDanger} >
      {errorText}
    </small>
  );
}
