
import { h } from '@stencil/core';
import { loadingSpinner } from '../styles/parts';

const Spinner = () => {
  return (
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status" part={loadingSpinner}>
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
