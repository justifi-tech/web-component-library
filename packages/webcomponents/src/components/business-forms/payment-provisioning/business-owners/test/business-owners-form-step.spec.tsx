import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessOwnersFormStep } from '../business-owners-form-step';
import { CountryCode } from '../../../../../utils/country-codes';
import { BusinessFormStep } from '../../../utils/event-types';
import { ComponentErrorCodes } from '../../../../../api/ComponentError';

const MOCK_REP = { id: 'rep_123', name: 'Jane Doe' };
const MOCK_OWNERS = [{ id: 'owner_1' }];

async function setupComponent(
  owners: { id: string }[] = [],
  repData: Record<string, unknown> = {}
) {
  const page = await newSpecPage({
    components: [BusinessOwnersFormStep],
    template: () => (
      <business-owners-form-step
        authToken="test-token"
        businessId="biz_123"
        country={CountryCode.USA}
      />
    ),
  });
  const mockGet = jest.fn(({ onSuccess, final }) => {
    onSuccess({
      data: {
        owners,
        representative: repData || MOCK_REP,
      },
    });
    final?.();
  });
  const mockPatch = jest.fn();
  page.rootInstance.getBusiness = mockGet;
  page.rootInstance.patchBusiness = mockPatch;
  // @ts-ignore - accessing private method for testing
  page.rootInstance.getData();
  await page.waitForChanges();
  return { page, mockGet, mockPatch };
}

function createMockRef(ownershipPercentage: string = '100') {
  return {
    validate: jest.fn().mockResolvedValue(true),
    submit: jest.fn().mockResolvedValue(true),
    getOwnershipPercentage: jest.fn().mockResolvedValue(ownershipPercentage),
    setOwnershipPercentageError: jest.fn().mockResolvedValue(undefined),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('business-owners-form-step', () => {
  describe('missing props', () => {
    it('emits error-event with MISSING_PROPS when authToken and businessId not provided', async () => {
      const captured: unknown[] = [];
      const page = await newSpecPage({
        components: [BusinessOwnersFormStep],
        template: () => (
          <div
            ref={(el) => {
              if (el) el.addEventListener('error-event', (e: Event) => captured.push((e as CustomEvent).detail));
            }}
          >
            {/* @ts-ignore - intentionally omit authToken/businessId */}
            <business-owners-form-step country={CountryCode.USA} />
          </div>
        ),
      });
      await page.waitForChanges();

      expect(captured).toContainEqual(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.MISSING_PROPS,
          message: 'Missing required props',
        })
      );
    });
  });

  describe('rendering', () => {
    it('renders host element', async () => {
      const { page } = await setupComponent(MOCK_OWNERS);

      expect(page.root.tagName).toBe('BUSINESS-OWNERS-FORM-STEP');
    });
  });

  describe('loading state', () => {
    it('shows loading state while fetching', async () => {
      const { page } = await setupComponent();
      page.rootInstance.isLoading = true;
      await page.waitForChanges();

      expect(page.rootInstance.isLoading).toBe(true);
    });
  });

  describe('fetchData', () => {
    it('calls getBusiness when rendered with valid props', async () => {
      const { mockGet } = await setupComponent(MOCK_OWNERS);

      expect(mockGet).toHaveBeenCalled();
    });

    it('emits error-event on fetch failure', async () => {
      const page = await newSpecPage({
        components: [BusinessOwnersFormStep],
        template: () => (
          <business-owners-form-step
            authToken="test-token"
            businessId="biz_123"
            country={CountryCode.USA}
          />
        ),
      });
      const mockGet = jest.fn(({ onError, final }) => {
        onError({
          error: 'fetch failed',
          code: ComponentErrorCodes.FETCH_ERROR,
          severity: 'error',
        });
        final?.();
      });
      page.rootInstance.getBusiness = mockGet;
      page.rootInstance.patchBusiness = jest.fn();
      const errorEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));

      // @ts-ignore
      page.rootInstance.getData();
      await page.waitForChanges();

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.FETCH_ERROR,
          message: 'fetch failed',
        })
      );
    });
  });

  describe('rep-is-owner prompt', () => {
    it('shows rep-is-owner prompt when representativeIsOwner is null and rep not in owners', async () => {
      const { page } = await setupComponent([], MOCK_REP);

      const prompt = page.root.querySelector('.alert-warning');
      expect(prompt).toBeTruthy();
      expect(prompt?.textContent).toContain('Is the representative of this business also an owner?');
    });

    it('rep-is-owner Yes: patches with representative id and refreshes', async () => {
      const { page, mockGet, mockPatch } = await setupComponent([], MOCK_REP);
      mockPatch.mockImplementation(({ onSuccess, finally: fn }) => {
        onSuccess?.();
        fn?.();
      });
      mockGet.mockImplementation(({ onSuccess, final }) => {
        onSuccess({
          data: {
            owners: [{ id: MOCK_REP.id }],
            representative: MOCK_REP,
          },
        });
        final?.();
      });

      page.rootInstance.handleRepresentativeIsOwnerChange(true);
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            owners: [{ id: MOCK_REP.id }],
          }),
        })
      );
      expect(page.rootInstance.ownersPayload.some((o) => o.id === MOCK_REP.id)).toBe(true);
    });

    it('rep-is-owner No: sets representativeIsOwner to false, prompt hidden', async () => {
      const { page } = await setupComponent([], MOCK_REP);

      page.rootInstance.handleRepresentativeIsOwnerChange(false);
      await page.waitForChanges();

      expect(page.rootInstance.representativeIsOwner).toBe(false);
      expect(page.root.querySelector('.alert-warning')).toBeNull();
    });

    it('rep-is-owner No: keeps blank owner row for manual entry', async () => {
      const { page } = await setupComponent([], MOCK_REP);

      expect(page.rootInstance.ownersPayload).toEqual([{ id: '' }]);

      page.rootInstance.handleRepresentativeIsOwnerChange(false);
      await page.waitForChanges();

      expect(page.rootInstance.ownersPayload).toEqual([{ id: '' }]);
    });
  });

  describe('removeOwnerForm', () => {
    it('removes owner id from ownersPayload', async () => {
      const { page } = await setupComponent([{ id: 'a' }, { id: 'b' }]);

      page.rootInstance.removeOwnerForm('a');
      await page.waitForChanges();

      expect(page.rootInstance.ownersPayload).toEqual([{ id: 'b' }]);
    });

    it('clears newFormOpen when removing blank owner row', async () => {
      const { page } = await setupComponent([{ id: 'owner_1' }, { id: '' }]);
      page.rootInstance.newFormOpen = true;
      await page.waitForChanges();

      page.rootInstance.removeOwnerForm('');
      await page.waitForChanges();

      expect(page.rootInstance.newFormOpen).toBe(false);
      expect(page.rootInstance.ownersPayload).toEqual([{ id: 'owner_1' }]);
    });
  });

  describe('Add Owner button', () => {
    it('showAddOwnerButton is true when < 4 owners and no new form open', async () => {
      const { page } = await setupComponent([{ id: 'o1' }]);
      page.rootInstance.newFormOpen = false;
      await page.waitForChanges();

      expect(page.rootInstance.showAddOwnerButton).toBe(true);
    });

    it('showAddOwnerButton is false when 4 owners', async () => {
      const { page } = await setupComponent([
        { id: 'o1' },
        { id: 'o2' },
        { id: 'o3' },
        { id: 'o4' },
      ]);
      await page.waitForChanges();

      expect(page.rootInstance.showAddOwnerButton).toBe(false);
    });

    it('hides Add Owner button in DOM when 4 owners', async () => {
      const { page } = await setupComponent([
        { id: 'o1' },
        { id: 'o2' },
        { id: 'o3' },
        { id: 'o4' },
      ]);
      await page.waitForChanges();

      const buttons = Array.from(page.root.querySelectorAll('button'));
      const addOwner = buttons.find((b) => b.textContent?.trim() === 'Add Owner');
      expect(addOwner?.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('validateAndSubmit', () => {
    it('calls validate and submit on all refs, then sendData', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef = createMockRef();
      page.rootInstance.refs = [mockRef];
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockRef.validate).toHaveBeenCalled();
      expect(mockRef.submit).toHaveBeenCalled();
      expect(mockPatch).toHaveBeenCalled();
    });

    it('does not call sendData when ownership percentages do not total 100%', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef1 = createMockRef('30');
      const mockRef2 = createMockRef('20');
      page.rootInstance.refs = [mockRef1, mockRef2];

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();

      expect(mockRef1.setOwnershipPercentageError).toHaveBeenCalledWith('Ownership percentages must total 100%');
      expect(mockRef2.setOwnershipPercentageError).toHaveBeenCalledWith('Ownership percentages must total 100%');
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('proceeds when ownership percentages total exactly 100%', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef1 = createMockRef('60');
      const mockRef2 = createMockRef('40');
      page.rootInstance.refs = [mockRef1, mockRef2];
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockRef1.setOwnershipPercentageError).not.toHaveBeenCalled();
      expect(mockPatch).toHaveBeenCalled();
    });

    it('skips total percentage validation when allowOptionalFields is true', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      page.rootInstance.allowOptionalFields = true;
      const mockRef1 = createMockRef('30');
      const mockRef2 = createMockRef('20');
      page.rootInstance.refs = [mockRef1, mockRef2];
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockRef1.setOwnershipPercentageError).not.toHaveBeenCalled();
      expect(mockPatch).toHaveBeenCalled();
    });

    it('does not call sendData when any ref.validate() fails', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef = createMockRef();
      mockRef.validate.mockResolvedValue(false);
      page.rootInstance.refs = [mockRef];

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).not.toHaveBeenCalled();
    });
  });

  describe('ownerSubmitted listener', () => {
    it('updates ownersPayload when ownerSubmitted event fires', async () => {
      const { page } = await setupComponent([{ id: '' }]);
      const submittedOwner = { id: 'new_owner_123', name: 'New Owner' };

      page.root.dispatchEvent(
        new CustomEvent('ownerSubmitted', { detail: submittedOwner, bubbles: true })
      );
      await page.waitForChanges();

      expect(page.rootInstance.ownersPayload).toContainEqual(
        expect.objectContaining({ id: 'new_owner_123' })
      );
    });
  });

  describe('sendData', () => {
    it('calls patchBusiness with correct owners payload', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef = createMockRef();
      page.rootInstance.refs = [mockRef];
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            owners: MOCK_OWNERS,
          }),
        })
      );
    });

    it('emits error-event on patch failure', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef = createMockRef();
      page.rootInstance.refs = [mockRef];
      mockPatch.mockImplementation(({ onError, final }) => {
        onError({
          error: 'server error',
          code: ComponentErrorCodes.PATCH_ERROR,
          severity: 'error',
        });
        final?.();
      });

      const errorEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.PATCH_ERROR,
          message: 'server error',
        })
      );
    });

    it('emits complete-form-step-event with BusinessFormStep.owners', async () => {
      const { page, mockPatch } = await setupComponent(MOCK_OWNERS);
      const mockRef = createMockRef();
      page.rootInstance.refs = [mockRef];
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      const stepCompleteEvent = jest.fn();
      page.root.addEventListener('complete-form-step-event', (e: CustomEvent) => stepCompleteEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          formStep: BusinessFormStep.owners,
        })
      );
    });
  });

  describe('formLoading events', () => {
    it('emits formLoading true then false around getData', async () => {
      const page = await newSpecPage({
        components: [BusinessOwnersFormStep],
        template: () => (
          <business-owners-form-step
            authToken="test-token"
            businessId="biz_123"
            country={CountryCode.USA}
          />
        ),
      });

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      const mockGet = jest.fn(({ onSuccess, final }) => {
        onSuccess({ data: { owners: [], representative: {} } });
        final?.();
      });
      page.rootInstance.getBusiness = mockGet;
      page.rootInstance.patchBusiness = jest.fn();
      // @ts-ignore
      page.rootInstance.getData();
      await page.waitForChanges();

      expect(formLoadingEvents).toContain(true);
      expect(formLoadingEvents).toContain(false);
    });
  });
});
