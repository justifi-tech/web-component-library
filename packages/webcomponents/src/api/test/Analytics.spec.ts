import JustifiAnalytics from '../Analytics';
import { AnalyticsService } from '../services/analytics.service';

jest.mock('../services/analytics.service');

describe('JustifiAnalytics', () => {
  let mockComponent: any;
  let analytics: JustifiAnalytics;
  let addEventListenerSpy: jest.Mock;
  let removeEventListenerSpy: jest.Mock;

  beforeEach(() => {
    // Mock window.location to avoid early return in constructor
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
      },
      writable: true,
    });

    // Create spies for event listener methods
    addEventListenerSpy = jest.fn();
    removeEventListenerSpy = jest.fn();

    // Create a mock component instance
    mockComponent = {
      tagName: 'test-component',
      accountId: 'test-account-123',
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      componentDidLoad: jest.fn(),
    };

    // Mock AnalyticsService.prototype.record
    AnalyticsService.prototype.record = jest.fn().mockResolvedValue(undefined);

    analytics = new JustifiAnalytics(mockComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('event listener management', () => {
    it('should add event listeners for submit-event and error-event', () => {
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(addEventListenerSpy).toHaveBeenCalledWith('submit-event', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('error-event', expect.any(Function));
    });

    it('should store event listener references in eventListeners Map', () => {
      expect(analytics['eventListeners'].size).toBe(2);
      expect(analytics['eventListeners'].has('submit-event')).toBe(true);
      expect(analytics['eventListeners'].has('error-event')).toBe(true);
    });

    it('should properly remove event listeners on cleanup', () => {
      // Get the handlers that were added
      const submitHandler = analytics['eventListeners'].get('submit-event');
      const errorHandler = analytics['eventListeners'].get('error-event');

      // Call cleanup
      analytics.cleanup();

      // Verify removeEventListener was called with the correct handlers
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('submit-event', submitHandler);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('error-event', errorHandler);
    });

    it('should clear eventListeners Map after cleanup', () => {
      analytics.cleanup();
      expect(analytics['eventListeners'].size).toBe(0);
    });

    it('should use the same handler reference for add and remove', () => {
      // Get the handler that was added
      const addedHandler = addEventListenerSpy.mock.calls[0][1];
      const storedHandler = analytics['eventListeners'].get('submit-event');

      // Verify they are the same reference
      expect(addedHandler).toBe(storedHandler);

      // Call cleanup
      analytics.cleanup();

      // Verify the same reference is used for removal
      const removedHandler = removeEventListenerSpy.mock.calls[0][1];
      expect(removedHandler).toBe(storedHandler);
      expect(removedHandler).toBe(addedHandler);
    });
  });

  describe('memory leak prevention', () => {
    it('should not leak memory after multiple mount/unmount cycles', () => {
      // Simulate multiple mount/unmount cycles
      for (let i = 0; i < 5; i++) {
        const newMockComponent = {
          tagName: `test-component-${i}`,
          accountId: `test-account-${i}`,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          componentDidLoad: jest.fn(),
        };

        const newAnalytics = new JustifiAnalytics(newMockComponent);

        // Verify listeners are added
        expect(newMockComponent.addEventListener).toHaveBeenCalledTimes(2);

        // Cleanup
        newAnalytics.cleanup();

        // Verify listeners are removed
        expect(newMockComponent.removeEventListener).toHaveBeenCalledTimes(2);

        // Verify Map is cleared
        expect(newAnalytics['eventListeners'].size).toBe(0);
      }
    });
  });

  describe('event handling', () => {
    it('should call handleCustomEvent when event is triggered', async () => {
      // Get the handler that was registered
      const submitHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'submit-event'
      )[1];

      // Mock event
      const mockEvent = {
        detail: { test: 'data' },
      };

      // Trigger the handler
      await submitHandler(mockEvent);

      // Verify handleCustomEvent was called through AnalyticsService.record
      expect(AnalyticsService.prototype.record).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'submit-event',
          data: expect.objectContaining({
            error: { test: 'data' },
          }),
        })
      );
    });
  });

  describe('localhost and storybook exclusion', () => {
    it('should not initialize analytics on localhost', () => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost:3000',
        },
        writable: true,
      });

      const localMockComponent = {
        tagName: 'test-component',
        addEventListener: jest.fn(),
      };

      const localAnalytics = new JustifiAnalytics(localMockComponent);

      // Should not have called addEventListener since we're on localhost
      expect(localMockComponent.addEventListener).not.toHaveBeenCalled();
      expect(localAnalytics.service).toBeUndefined();
    });

    it('should not initialize analytics on storybook', () => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://storybook.example.com',
        },
        writable: true,
      });

      const storybookMockComponent = {
        tagName: 'test-component',
        addEventListener: jest.fn(),
      };

      const storybookAnalytics = new JustifiAnalytics(storybookMockComponent);

      // Should not have called addEventListener since we're on storybook
      expect(storybookMockComponent.addEventListener).not.toHaveBeenCalled();
      expect(storybookAnalytics.service).toBeUndefined();
    });
  });
});
