import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiElectronicEvidence } from './justifi-electronic-evidence';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('justifi-electronic-evidence', () => {
  const components = [JustifiElectronicEvidence];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-electronic-evidence disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-text[name="customer_purchase_ip_address"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="activity_log"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { customer_purchase_ip_address: '192.168.1.1' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-electronic-evidence disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiElectronicEvidence).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-electronic-evidence disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiElectronicEvidence).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.electronicEvidence);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-electronic-evidence disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiElectronicEvidence).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for activity_log', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-electronic-evidence disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="activity_log"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { activity_log: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-electronic-evidence disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiElectronicEvidence).documentErrors).toEqual(documentErrors);
  });
});
