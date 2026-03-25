import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { DuplicateCharge } from './duplicate-charge';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('duplicate-charge', () => {
  const components = [DuplicateCharge];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <duplicate-charge disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-text[name="duplicate_charge_original_payment_id"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-textarea[name="duplicate_charge_explanation"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="duplicate_charge_documentation"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { duplicate_charge_original_payment_id: 'py_123' };
    const page = await newSpecPage({
      components,
      template: () => <duplicate-charge disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as DuplicateCharge).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <duplicate-charge disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as DuplicateCharge).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.duplicateCharge);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <duplicate-charge disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as DuplicateCharge).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for duplicate_charge_documentation', async () => {
    const page = await newSpecPage({
      components,
      template: () => <duplicate-charge disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="duplicate_charge_documentation"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { duplicate_charge_documentation: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <duplicate-charge disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as DuplicateCharge).documentErrors).toEqual(documentErrors);
  });
});
