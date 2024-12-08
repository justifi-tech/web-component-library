import { h } from '@stencil/core';

export const FormLabel = ({ htmlFor, label, helpText }) => {
  return (
    <label
      part="label"
      class="form-label d-flex gap-2 align-items-center"
      htmlFor={htmlFor}
    >
      {label}
      <form-control-tooltip helpText={helpText} />
    </label>);
}
