import { newSpecPage } from '@stencil/core/testing';
import { BusinessFormStepped } from '../business-form-stepped';


describe.skip('justifi-business-form-stepped', () => {
  let consoleSpy;

  // Initialize the spy in the beforeEach
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  // Restore the original function in the afterEach
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log a warning if no authToken is provided', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped></justifi-business-form-stepped>`,
    });

  });

  it('should log a warning if no businessId is provided', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped></justifi-business-form-stepped>`,
    });

  });

  it('should emit server error event if server error when fetching data', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped business-id="biz_123" auth-token="some-token"></justifi-business-form-stepped>`,
    });

  });

  it('should emit server error event if server error when patching data', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped business-id="biz_123" auth-token="some-token"></justifi-business-form-stepped>`,
    });

  });


  it('should render', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped business-id="biz_123" auth-token="some-token"></justifi-business-form-stepped>`,
    });

  });

  it('should call onSuccess when a step is successfully completed', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped business-id="biz_123" auth-token="some-token"></justifi-business-form-stepped>`,
    });

  });

  it('should emit clickEvent when a button is clicked', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped business-id="biz_123" auth-token="some-token"></justifi-business-form-stepped>`,
    });

  });

  it('should emit submitted event when a step is completed', async () => {
    await newSpecPage({
      components: [BusinessFormStepped],
      html: `<justifi-business-form-stepped business-id="biz_123" auth-token="some-token"></justifi-business-form-stepped>`,
    });

  });
});
