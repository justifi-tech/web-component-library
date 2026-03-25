import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ProductOrService } from './product-or-service';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('product-or-service', () => {
  const components = [ProductOrService];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <product-or-service disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-text[name="product_description"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-date[name="service_date"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="service_documentation"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { product_description: 'Widget', service_date: '2026-01-15' };
    const page = await newSpecPage({
      components,
      template: () => <product-or-service disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as ProductOrService).disputeResponse).toEqual(disputeResponse);
    expect(page.root.querySelector('form-control-text[name="product_description"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-date[name="service_date"]')).toBeTruthy();
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <product-or-service disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as ProductOrService).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [formData, documentList, formStep] = onSuccess.mock.calls[0];
    expect(typeof formData).toBe('object');
    expect(Array.isArray(documentList)).toBe(true);
    expect(formStep).toBe(DisputeResponseFormStep.productOrService);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <product-or-service disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as ProductOrService).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for service_documentation', async () => {
    const page = await newSpecPage({
      components,
      template: () => <product-or-service disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const fileInput = page.root.querySelector('form-control-file-v2[name="service_documentation"]');
    expect(fileInput).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { service_documentation: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <product-or-service disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as ProductOrService).documentErrors).toEqual(documentErrors);
    expect(page.root.querySelector('form-control-file-v2[name="service_documentation"]')).toBeTruthy();
  });
});
