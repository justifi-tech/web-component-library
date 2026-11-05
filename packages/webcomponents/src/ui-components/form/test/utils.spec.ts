import { zipCodeOnlyHandler } from '../utils';

// Stencil's mock DOM has a real `KeyboardEvent` but no `ClipboardEvent`, so a
// paste is represented by the minimal shape the handler actually reads.
const keyDown = (key: string, currentValue = '', init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, cancelable: true, ...init });
  Object.defineProperty(event, 'target', { value: { value: currentValue }, configurable: true });
  return event;
};

const paste = (clipboardText: string) => {
  const preventDefault = jest.fn();
  const event = {
    clipboardData: { getData: () => clipboardText },
    preventDefault,
  } as unknown as ClipboardEvent;
  return { event, preventDefault };
};

describe('zipCodeOnlyHandler', () => {
  describe('typing', () => {
    it('allows a digit', () => {
      // Arrange
      const event = keyDown('4', '4424');

      // Act
      zipCodeOnlyHandler(event);

      // Assert
      expect(event.defaultPrevented).toBe(false);
    });

    it('allows the hyphen that separates a ZIP from its +4', () => {
      const event = keyDown('-', '44240');

      zipCodeOnlyHandler(event);

      expect(event.defaultPrevented).toBe(false);
    });

    it('blocks a letter', () => {
      const event = keyDown('a', '44240');

      zipCodeOnlyHandler(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('blocks a second hyphen', () => {
      const event = keyDown('-', '44240-5');

      zipCodeOnlyHandler(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('allows navigation and editing keys', () => {
      const event = keyDown('Backspace', '44240-');

      zipCodeOnlyHandler(event);

      expect(event.defaultPrevented).toBe(false);
    });

    it('allows the paste shortcut itself through', () => {
      const event = keyDown('v', '', { metaKey: true });

      zipCodeOnlyHandler(event);

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('pasting', () => {
    it('allows a ZIP+4', () => {
      const { event, preventDefault } = paste('44240-5555');

      zipCodeOnlyHandler(event);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('allows a 5-digit ZIP', () => {
      const { event, preventDefault } = paste('55114');

      zipCodeOnlyHandler(event);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('blocks letters', () => {
      const { event, preventDefault } = paste('N2B 2A5');

      zipCodeOnlyHandler(event);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('blocks a value carrying more than one hyphen', () => {
      const { event, preventDefault } = paste('44240-5555-1');

      zipCodeOnlyHandler(event);

      expect(preventDefault).toHaveBeenCalled();
    });
  });
});
