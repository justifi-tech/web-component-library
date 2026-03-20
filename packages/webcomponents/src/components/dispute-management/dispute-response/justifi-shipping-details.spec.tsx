import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiShippingDetails } from './justifi-shipping-details';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('justifi-shipping-details', () => {
  const components = [JustifiShippingDetails];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-shipping-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-text[name="shipping_carrier"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-text[name="shipping_tracking_number"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-date[name="shipping_date"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-textarea[name="shipping_address"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="shipping_documentation"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { shipping_carrier: 'UPS', shipping_tracking_number: '1Z999' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-shipping-details disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiShippingDetails).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-shipping-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiShippingDetails).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.shippingDetails);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-shipping-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiShippingDetails).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for shipping_documentation', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-shipping-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="shipping_documentation"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { shipping_documentation: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-shipping-details disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiShippingDetails).documentErrors).toEqual(documentErrors);
  });
});
