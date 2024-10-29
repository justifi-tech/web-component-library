import { h } from '@stencil/core';

export const FormControlErrorText = (props: { errorText: string, name: string }) => {
  const { errorText, name } = props;

  if (!errorText) {
    return null;
  }

  return (
    <small class='form-text text-danger' id={`form-error-text-${name}`} part="input-error-text" >
      {errorText}
    </small>
  );
}
