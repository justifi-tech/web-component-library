import { newSpecPage } from '@stencil/core/testing';
import { BusinessCoreInfoFormStep } from '../business-core-info-form-step';


describe.skip('justifi-business-core-info-form-step', () => {
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
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step></justifi-business-core-info-form-step>`,
    });

  });

  it('should log a warning if no businessId is provided', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step></justifi-business-core-info-form-step>`,
    });

  });

  it('should emit server error event if server error when fetching data', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should emit server error event if server error when patching data', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });


  it('should render', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should call fetchData if rendered with valid props', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should populate inputs with data from fetchData', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should instantiate new Form Controller on load', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should fire form controller validation when called', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should only call submit after validate returns true', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should call sendData when submit is called', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should send correct data payload', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should emit submitted event when sendData resolves', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

  it('should emit formLoading event when data is being sent or fetched', async () => {
    await newSpecPage({
      components: [BusinessCoreInfoFormStep],
      html: `<justifi-business-core-info-form-step business-id="biz_123" auth-token="some-token"></justifi-business-core-info-form-step>`,
    });

  });

});
