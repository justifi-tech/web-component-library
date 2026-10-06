import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { RefundPolicy } from './refund-policy';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('refund-policy', () => {
  const components = [RefundPolicy];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <refund-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-textarea[name="refund_policy_disclosure"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-textarea[name="refund_refusal_explanation"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="refund_policy"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="receipt"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { refund_policy_disclosure: 'Refund policy' };
    const page = await newSpecPage({
      components,
      template: () => <refund-policy disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as RefundPolicy).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <refund-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as RefundPolicy).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.refundPolicy);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <refund-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as RefundPolicy).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file inputs for refund_policy and receipt', async () => {
    const page = await newSpecPage({
      components,
      template: () => <refund-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="refund_policy"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="receipt"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { refund_policy: 'Invalid file' };
    const page = await newSpecPage({
      components,
      template: () => <refund-policy disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as RefundPolicy).documentErrors).toEqual(documentErrors);
  });
});
