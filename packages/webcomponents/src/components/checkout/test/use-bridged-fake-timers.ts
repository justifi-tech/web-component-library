// Stencil's mock window retains native timers, so bridge it to Jest's timers.
export const useBridgedFakeTimers = () => {
  jest.useFakeTimers({
    doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate'],
  });
  const setTimeoutSpy = jest.spyOn(window, 'setTimeout').mockImplementation(globalThis.setTimeout);
  const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout').mockImplementation(globalThis.clearTimeout);

  return () => {
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
    jest.clearAllTimers();
    jest.useRealTimers();
  };
};
