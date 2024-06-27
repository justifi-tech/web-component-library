import { h } from '@stencil/core';

export const LoadingSpinner = () => (
  <div class="spinner-border spinner-border-sm" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
);

export const numberOnlyHandler = (e: KeyboardEvent) => {
  const specialKeys = ['Backspace', 'Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete'];


  // Check if the key is a special key
  if (specialKeys.includes(e.key)) {
    return;
  }

  // Allow Ctrl+V / Command+V for pasting
  const isPaste =
    (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';

  if (isPaste) {
    return;
  }

  // Prevent default action if the key is not a digit
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};
