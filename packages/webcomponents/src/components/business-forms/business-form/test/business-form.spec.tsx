import { h } from "@stencil/core";
import { newSpecPage } from '@stencil/core/testing';
import { BusinessForm } from '../business-form';
import JustifiAnalytics from '../../../../api/Analytics';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-business-form', () => {
  let consoleSpy;

  // Initialize the spy in the beforeEach
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  // Restore the original function in the afterEach
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('emit an error event when accountId and authToken are not provided', async () => {
      const errorEvent = jest.fn();
      const page = await newSpecPage({
        components: [BusinessForm],
        template: () => <justifi-business-form onError-event={errorEvent} />,
      });
      await page.waitForChanges();
      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            errorCode: 'missing-props',
            message: 'auth-token and business-id are required',
            severity: 'error',
          },
        })
      );
    });

  it('should not log a warning if an authToken is provided', async () => {
    await newSpecPage({
      components: [BusinessForm],
      html: `<justifi-business-form business-id="biz_123" auth-token="some-token"></justifi-business-form>`,
    });

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
