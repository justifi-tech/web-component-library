export const numberOnlyHandler = (e: KeyboardEvent | ClipboardEvent) => {
  const specialKeys = ['Backspace', 'Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete'];

  // Check if the key is a special key
  if (e instanceof KeyboardEvent && specialKeys.includes(e.key)) {
    return;
  }

  // Allow Ctrl+V / Command+V for pasting
  const isPaste = e instanceof KeyboardEvent && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';

  if (isPaste) {
    return;
  }

  // Handle paste event
  if (e instanceof ClipboardEvent) {
    const clipboardData = e.clipboardData?.getData('text');
    if (clipboardData && !/^\d+$/.test(clipboardData)) {
      e.preventDefault();
    }
    return;
  }

  // Prevent default action if the key is not a digit
  if (e instanceof KeyboardEvent && !/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

// A US ZIP+4 ("44240-5555") carries a hyphen, which numberOnlyHandler blocks,
// so the postal field gets its own handler: digits plus a single hyphen.
export const zipCodeOnlyHandler = (e: KeyboardEvent | ClipboardEvent) => {
  const specialKeys = ['Backspace', 'Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete'];

  // Handle paste event. `ClipboardEvent` is not a global in the spec
  // environment, so the paste branch is recognized by its payload.
  if ('clipboardData' in e) {
    const clipboardData = e.clipboardData?.getData('text');
    if (clipboardData && !/^\d+(-\d+)?$/.test(clipboardData)) {
      e.preventDefault();
    }
    return;
  }

  // Check if the key is a special key
  if (specialKeys.includes(e.key)) {
    return;
  }

  // Allow Ctrl+V / Command+V for pasting
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
    return;
  }

  // A single hyphen separates the ZIP from the +4; a second one never does.
  const alreadyHyphenated = !!(e.target as HTMLInputElement)?.value?.includes('-');
  if (e.key === '-' && !alreadyHyphenated) {
    return;
  }

  // Prevent default action if the key is not a digit
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};
