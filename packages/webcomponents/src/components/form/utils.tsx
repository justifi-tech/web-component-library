import { h } from '@stencil/core';

export const FormAlert = ( message: string ) => (
  <div class='alert alert-danger' role='alert'>
    {message}
  </div>
);
