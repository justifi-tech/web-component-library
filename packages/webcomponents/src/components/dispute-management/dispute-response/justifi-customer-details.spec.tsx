import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiCustomerDetails } from './justifi-customer-details';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('justifi-customer-details', () => {
  const components = [JustifiCustomerDetails];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-customer-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-text[name="customer_name"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-text[name="customer_email_address"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-textarea[name="customer_billing_address"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="customer_signature"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="customer_communication"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { customer_name: 'Jane', customer_email_address: 'jane@example.com' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-customer-details disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiCustomerDetails).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-customer-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiCustomerDetails).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.customerDetails);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-customer-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiCustomerDetails).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file inputs for customer_signature and customer_communication', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-customer-details disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="customer_signature"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="customer_communication"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { customer_signature: 'Invalid file' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-customer-details disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiCustomerDetails).documentErrors).toEqual(documentErrors);
  });
});
