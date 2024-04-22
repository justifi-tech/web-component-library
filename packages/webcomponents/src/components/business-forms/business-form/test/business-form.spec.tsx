import { newSpecPage } from '@stencil/core/testing';
import { BusinessForm } from '../business-form';

describe('justifi-business-form', () => {
  let consoleSpy;

  // Initialize the spy in the beforeEach
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
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

  it('should log a warning if no businessId is provided', async () => {
    await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form></justifi-business-form>`,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Warning: Missing business-id. The form requires an existing business-id to function.');
  });

  it('should not log a warning if an authToken is provided', async () => {
    await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form business-id="biz_123" auth-token="some-token"></justifi-business-form>`,
    });

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
