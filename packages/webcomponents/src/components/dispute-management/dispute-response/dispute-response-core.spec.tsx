jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiDisputeResponseCore } from './dispute-response-core';
import { JustifiProductOrService } from './justifi-product-or-service';
import { JustifiCustomerDetails } from './justifi-customer-details';
import { JustifiCancellationPolicy } from './justifi-cancellation-policy';
import { JustifiRefundPolicy } from './justifi-refund-policy';
import { JustifiDuplicateCharge } from './justifi-duplicate-charge';
import { JustifiElectronicEvidence } from './justifi-electronic-evidence';
import { JustifiShippingDetails } from './justifi-shipping-details';
import { JustifiAdditionalStatement } from './justifi-additional-statement';
import { DisputeManagementClickActions } from '../event-types';
import { DisputeResponseFormStep } from './dispute-response-form-types';

const components = [
  JustifiDisputeResponseCore,
  JustifiProductOrService,
  JustifiCustomerDetails,
  JustifiCancellationPolicy,
  JustifiRefundPolicy,
  JustifiDuplicateCharge,
  JustifiElectronicEvidence,
  JustifiShippingDetails,
  JustifiAdditionalStatement,
];

const mockUpdate = jest.fn(({ payload, onSuccess }) => {
  onSuccess({ data: payload });
  return Promise.resolve({ data: payload } as any);
});

const mockSubmit = jest.fn(({ payload, onSuccess }) => {
  onSuccess({ data: payload });
  return Promise.resolve({ data: payload } as any);
});

const mockCreateEvidence = jest.fn(({ onSuccess }) => {
  onSuccess({ data: { presigned_url: 'https://presigned.example/upload' } });
  return Promise.resolve({ data: { presigned_url: 'https://presigned.example/upload' } } as any);
});

async function setupPage(disputeResponse = {}) {
  const page = await newSpecPage({
    components,
    template: () => (
      <justifi-dispute-response-core
        updateDisputeResponse={mockUpdate}
        submitDisputeResponse={mockSubmit}
        createDisputeEvidence={mockCreateEvidence}
        disputeResponse={disputeResponse}
      />
    ),
  });
  await page.waitForChanges();
  await new Promise((r) => setTimeout(r, 0));
  return page;
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
});

describe('justifi-dispute-response-core', () => {
  it('renders step 0 (justifi-product-or-service) on mount', async () => {
    const page = await setupPage();

    const step0 = page.root.querySelector('justifi-product-or-service');
    expect(step0).toBeTruthy();
    expect(page.root.querySelector('justifi-customer-details')).toBeFalsy();
  });

  it('complete-form-step-event on step N advances to step N+1', async () => {
    const page = await setupPage();
    const core = page.rootInstance as JustifiDisputeResponseCore;

    core.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => Promise.resolve(cb({ product_description: 'test' }, [], DisputeResponseFormStep.productOrService))),
    };
    await (core as any).onNext();
    await page.waitForChanges();

    expect(core.currentStep).toBe(1);
    expect(page.root.querySelector('justifi-customer-details')).toBeTruthy();
  });

  it('Back click on step N regresses to step N-1', async () => {
    const page = await setupPage();
    const core = page.rootInstance as JustifiDisputeResponseCore;

    core.currentStep = 1;
    core.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => Promise.resolve(cb({}, [], DisputeResponseFormStep.customerDetails))),
    };
    await (core as any).onBack();
    await page.waitForChanges();

    expect(core.currentStep).toBe(0);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('cancelDispute click emits click-event with cancelDispute', async () => {
    const page = await setupPage();
    const clickSpy = jest.fn();
    page.root.addEventListener('click-event', clickSpy);

    const cancelBtn = page.root.querySelector('button[class*="secondary"]') as HTMLButtonElement;
    cancelBtn?.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { name: DisputeManagementClickActions.cancelDispute },
      })
    );
  });

  it('steps 0-6 call updateDisputeResponse (PATCH) on advance', async () => {
    const page = await setupPage();
    const core = page.rootInstance as JustifiDisputeResponseCore;

    core.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => Promise.resolve(cb({ product_description: 'test' }, [], DisputeResponseFormStep.productOrService))),
    };
    await (core as any).onNext();
    await page.waitForChanges();

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('step 7 calls submitDisputeResponse (POST) and emits submit-event', async () => {
    const page = await setupPage();
    const core = page.rootInstance as JustifiDisputeResponseCore;
    const submitSpy = jest.fn();
    page.root.addEventListener('submit-event', submitSpy);

    core.currentStep = 7;
    core.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => Promise.resolve(cb({ additional_statement: 'final' }, [], DisputeResponseFormStep.additionalStatement))),
    };
    await (core as any).onSubmit();
    await page.waitForChanges();

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ additional_statement: 'final', forfeit: false }),
      })
    );
    expect(submitSpy).toHaveBeenCalled();
  });

  it('non-empty documentList calls createDisputeEvidence (PUT) before advancing', async () => {
    const page = await setupPage();
    const core = page.rootInstance as JustifiDisputeResponseCore;

    const doc: any = { file_name: 'doc.pdf', file_type: 'application/pdf', dispute_evidence_type: 'service_documentation', getFileString: () => Promise.resolve(new ArrayBuffer(8)) };
    core.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => {
        doc.presignedUrl = 'https://presigned.example/upload';
        return Promise.resolve(cb({ product_description: 'test' }, [doc], DisputeResponseFormStep.productOrService));
      }),
    };
    await (core as any).onNext();
    await page.waitForChanges();

    expect(mockCreateEvidence).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          file_name: 'doc.pdf',
          file_type: 'application/pdf',
          dispute_evidence_type: 'service_documentation',
        }),
      })
    );
  });

  it('upload failure passes documentErrors to current step component', async () => {
    const createEvidenceWithError = jest.fn(({ onError }) => {
      onError({ error: 'Presign failed', code: 'err', severity: 'error' });
      return Promise.resolve({} as any);
    });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-response-core
          updateDisputeResponse={mockUpdate}
          submitDisputeResponse={mockSubmit}
          createDisputeEvidence={createEvidenceWithError}
          disputeResponse={{}}
        />
      ),
    });
    await page.waitForChanges();

    const core = page.rootInstance as JustifiDisputeResponseCore;
    const doc: any = { file_name: 'doc.pdf', file_type: 'application/pdf', dispute_evidence_type: 'service_documentation', getFileString: () => Promise.resolve(new ArrayBuffer(8)) };
    core.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => Promise.resolve(cb({ product_description: 'test' }, [doc], DisputeResponseFormStep.productOrService))),
    };
    try {
      await (core as any).onNext();
    } catch {
      // handleSubmit throws when presigning fails
    }
    await page.waitForChanges();

    expect(core.documentErrors).toEqual(expect.objectContaining({ service_documentation: 'Presign failed' }));
  });

  it('disputeResponse prop forwarded as pre-population to each step', async () => {
    const disputeResponse = { product_description: 'Pre-filled product', customer_name: 'Jane Doe' };
    const page = await setupPage(disputeResponse);

    const productStep = page.root.querySelector('justifi-product-or-service');
    expect((productStep as any).disputeResponse).toEqual(disputeResponse);
  });
});
