import { newSpecPage } from '@stencil/core/testing';
import { BusinessForm } from '../business-form';

describe('justifi-business-form', () => {
  let consoleSpy;

  // Initialize the spy in the beforeEach
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  // Restore the original function in the afterEach
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log a warning if no authToken is provided', async () => {
    await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form></justifi-business-form>`,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Warning: Missing auth-token. The form will not be functional without it.');
  });

  it('should disable the submit button if no authToken is provided', async () => {
    const { root } = await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form></justifi-business-form>`,
    });

    const submitButton = root.querySelector('.jfi-submit-button');
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should not disable the submit button if an authToken is provided', async () => {
    const { root } = await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form auth-token="auth-token"></justifi-business-form>`,
    });

    const submitButton = root.querySelector('.jfi-submit-button');
    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('should not log a warning if an authToken is provided', async () => {
    await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form auth-token="some-token"></justifi-business-form>`,
    });

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
