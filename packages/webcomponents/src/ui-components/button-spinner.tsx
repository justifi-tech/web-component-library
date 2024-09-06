import { h } from '@stencil/core';

export const ButtonSpinner = () => (
  <div class="spinner-border spinner-border-sm" role="status" part="button-spinner">
    <span class="visually-hidden">Loading...</span>
  </div>
);
