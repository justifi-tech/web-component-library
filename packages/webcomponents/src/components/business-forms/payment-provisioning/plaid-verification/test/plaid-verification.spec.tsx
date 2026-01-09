import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PlaidVerification } from '../plaid-verification';
import { PlaidService } from '../../../../../api/services/plaid.service';
import { PlaidErrorCodes, PLAID_ERROR_MESSAGES } from '../../../../../api/Plaid';
import { ComponentErrorSeverity } from '../../../../../api/ComponentError';

// Mock PlaidService
jest.mock('../../../../../api/services/plaid.service');

describe('plaid-verification', () => {
  let mockPlaidService: jest.Mocked<PlaidService>;
  let mockPlaidLink: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Plaid SDK
    mockPlaidLink = {
      open: jest.fn(),
      exit: jest.fn(),
      destroy: jest.fn(),
    };

    // Mock window.Plaid
    (window as any).Plaid = {
      create: jest.fn().mockReturnValue(mockPlaidLink),
    };

    // Mock PlaidService methods
    mockPlaidService = {
      getLinkTokenForVerification: jest.fn(),
      postPlaidVerifiedBankAccountData: jest.fn(),
    } as any;

    PlaidService.prototype.getLinkTokenForVerification = mockPlaidService.getLinkTokenForVerification;
    PlaidService.prototype.postPlaidVerifiedBankAccountData = mockPlaidService.postPlaidVerifiedBankAccountData;
  });

  afterEach(() => {
    // Restore window.Plaid to mock instead of deleting it
    (window as any).Plaid = {
      create: jest.fn().mockReturnValue(mockPlaidLink),
    };
  });

  describe('render states', () => {
    it('should render with required props', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.waitForChanges();

      expect(page.root).toBeTruthy();
      expect(page.root.querySelector('button')).toBeTruthy();
      expect(page.root.querySelector('script[src*="plaid.com"]')).toBeTruthy();
    });

    it('should render button with Plaid logo', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.waitForChanges();

      const button = page.root.querySelector('button');
      expect(button.textContent).toContain('Link Bank Account with');
      expect(page.root.querySelector('.plaid-logo-img')).toBeTruthy();
    });

    it('should render loading state', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.isLoading = true;
      await page.waitForChanges();

      const loadingText = page.root.querySelector('.text-info small');
      expect(loadingText.textContent).toBe('Verifying bank account...');
      const button = page.root.querySelector('button');
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('should render success state', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.isSuccess = true;
      await page.waitForChanges();

      const successText = page.root.querySelector('.text-success small');
      expect(successText.textContent).toBe('✓ Bank account verified successfully');
    });

    it('should render authenticating state', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.isAuthenticating = true;
      await page.waitForChanges();

      const authText = page.root.querySelector('.text-info small');
      expect(authText.textContent).toBe('Connecting to your bank...');
    });

    it('should render error state', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.error = {
        code: PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED,
        message: 'Test error message',
        severity: ComponentErrorSeverity.ERROR,
        retryable: true,
        userAction: 'Click to try again',
      };
      await page.waitForChanges();

      const errorText = page.root.querySelector('.text-danger small');
      expect(errorText.textContent).toBe('Test error message');
      expect(page.root.textContent).toContain('Click to try again');
    });
  });

  describe('getLinkToken', () => {
    it('should successfully get link token', async () => {
      mockPlaidService.getLinkTokenForVerification.mockResolvedValue({
        data: {
          id: 'link_token_id_123',
          link_token: 'link_token_abc',
        },
        error: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(mockPlaidService.getLinkTokenForVerification).toHaveBeenCalledWith(
        'test-token',
        'biz_123',
        expect.any(AbortSignal)
      );
      expect(page.rootInstance.linkToken).toBe('link_token_abc');
      expect(page.rootInstance.linkTokenId).toBe('link_token_id_123');
    });

    it('should handle missing authToken', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED);
      expect(page.rootInstance.error.message).toContain('Missing authentication');
    });

    it('should handle missing accountId', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED);
    });

    it('should handle timeout error', async () => {
      const abortError = new Error('Request timeout');
      abortError.name = 'AbortError';
      mockPlaidService.getLinkTokenForVerification.mockRejectedValue(abortError);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_TIMEOUT);
      expect(page.rootInstance.error.message).toBe(PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_TIMEOUT]);
    });

    it('should handle network error', async () => {
      mockPlaidService.getLinkTokenForVerification.mockRejectedValue(
        new Error('network error occurred')
      );

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_NETWORK_ERROR);
    });

    it('should handle unauthorized error', async () => {
      mockPlaidService.getLinkTokenForVerification.mockRejectedValue(
        new Error('401 unauthorized')
      );

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_INVALID_CREDENTIALS);
      expect(page.rootInstance.error.retryable).toBe(false);
    });

    it('should handle API error response', async () => {
      mockPlaidService.getLinkTokenForVerification.mockResolvedValue({
        error: 'Failed to generate link token',
        data: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.getLinkToken();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED);
    });
  });

  describe('initializePlaidLink', () => {
    it('should initialize Plaid Link successfully', async () => {
      mockPlaidService.getLinkTokenForVerification.mockResolvedValue({
        data: {
          id: 'link_token_id_123',
          link_token: 'link_token_abc',
        },
        error: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      // Set up window.Plaid after page creation but before calling initializePlaidLink
      const createSpy = jest.fn().mockReturnValue(mockPlaidLink);
      (window as any).Plaid = { create: createSpy };

      await page.rootInstance.initializePlaidLink();
      await page.waitForChanges();

      expect(createSpy).toHaveBeenCalledWith({
        token: 'link_token_abc',
        onSuccess: page.rootInstance.handlePlaidSuccess,
        onExit: page.rootInstance.handlePlaidExit,
        onEvent: page.rootInstance.handlePlaidEvent,
        onLoad: page.rootInstance.handlePlaidLoad,
      });
      expect(page.rootInstance.plaidLink).toBe(mockPlaidLink);
    });

    it('should handle Plaid SDK not loaded', async () => {
      delete (window as any).Plaid;

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.initializePlaidLink();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_SDK_LOAD_FAILED);
    });

    it('should handle link token failure', async () => {
      mockPlaidService.getLinkTokenForVerification.mockResolvedValue({
        error: 'Failed to get token',
        data: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      // Set up window.Plaid after page creation but before calling initializePlaidLink
      (window as any).Plaid = {
        create: jest.fn().mockReturnValue(mockPlaidLink),
      };

      await page.rootInstance.initializePlaidLink();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED);
    });
  });

  describe('openPlaidLink', () => {
    it('should open Plaid Link when initialized', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.plaidLink = mockPlaidLink;
      page.rootInstance.linkToken = 'link_token_abc';

      page.rootInstance.openPlaidLink();
      await page.waitForChanges();

      expect(mockPlaidLink.open).toHaveBeenCalled();
      expect(page.rootInstance.isAuthenticating).toBe(true);
      expect(page.rootInstance.error).toBeNull();
    });

    it('should not open if plaidLink is not initialized', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.plaidLink = null;
      page.rootInstance.openPlaidLink();
      await page.waitForChanges();

      expect(mockPlaidLink.open).not.toHaveBeenCalled();
    });
  });

  describe('handlePlaidSuccess', () => {
    it('should handle successful bank account verification', async () => {
      const mockBankAccount = { id: 'bank_123', status: 'verified' };
      mockPlaidService.postPlaidVerifiedBankAccountData.mockResolvedValue({
        data: mockBankAccount,
        error: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      const successEventSpy = jest.fn();
      page.root.addEventListener('plaidVerificationSuccess', successEventSpy);

      page.rootInstance.linkTokenId = 'link_token_id_123';
      await page.rootInstance.handlePlaidSuccess('public_token_abc', {});
      await page.waitForChanges();

      expect(mockPlaidService.postPlaidVerifiedBankAccountData).toHaveBeenCalledWith(
        'test-token',
        'biz_123',
        { public_token: 'public_token_abc', link_token_id: 'link_token_id_123' },
        undefined
      );
      expect(page.rootInstance.isSuccess).toBe(true);
      expect(page.rootInstance.isLoading).toBe(false);
      expect(successEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            publicToken: 'public_token_abc',
            bankAccount: mockBankAccount,
          },
        })
      );
    });

    it('should handle bank account verification failure', async () => {
      mockPlaidService.postPlaidVerifiedBankAccountData.mockResolvedValue({
        error: 'Failed to verify bank account',
        data: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      const errorEventSpy = jest.fn();
      page.root.addEventListener('plaidVerificationError', errorEventSpy);

      await page.rootInstance.handlePlaidSuccess('public_token_abc', {});
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeTruthy();
      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED);
      expect(page.rootInstance.isLoading).toBe(false);
      expect(errorEventSpy).toHaveBeenCalled();
    });
  });

  describe('handlePlaidExit', () => {
    it('should handle exit without error', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.isAuthenticating = true;
      page.rootInstance.handlePlaidExit(null, {});
      await page.waitForChanges();

      expect(page.rootInstance.isAuthenticating).toBe(false);
      expect(page.rootInstance.error).toBeNull();
    });

    it('should handle exit with error', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      const plaidError = { error_code: 'INVALID_CREDENTIALS', error_message: 'Invalid credentials' };
      page.rootInstance.handlePlaidExit(plaidError, {});
      await page.waitForChanges();

      expect(page.rootInstance.isAuthenticating).toBe(false);
      expect(page.rootInstance.error).toBeTruthy();
    });
  });

  describe('handlePlaidEvent', () => {
    it('should handle OPEN event', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.handlePlaidEvent('OPEN', {});
      await page.waitForChanges();

      expect(page.rootInstance.isAuthenticating).toBe(true);
    });

    it('should handle CLOSE event', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.isAuthenticating = true;
      page.rootInstance.handlePlaidEvent('CLOSE', {});
      await page.waitForChanges();

      expect(page.rootInstance.isAuthenticating).toBe(false);
    });
  });

  describe('handlePlaidError', () => {
    it('should handle INVALID_CREDENTIALS error', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      const errorEventSpy = jest.fn();
      page.root.addEventListener('plaidVerificationError', errorEventSpy);

      page.rootInstance.handlePlaidError({ error_code: 'INVALID_CREDENTIALS' });
      await page.waitForChanges();

      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_INVALID_CREDENTIALS);
      expect(page.rootInstance.error.retryable).toBe(true);
      expect(errorEventSpy).toHaveBeenCalled();
    });

    it('should handle ITEM_LOCKED error', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.handlePlaidError({ error_code: 'ITEM_LOCKED' });
      await page.waitForChanges();

      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_ACCOUNT_LOCKED);
      expect(page.rootInstance.error.retryable).toBe(false);
      expect(page.rootInstance.error.userAction).toBe('Contact your bank');
    });

    it('should handle RATE_LIMIT_EXCEEDED error', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.handlePlaidError({ error_code: 'RATE_LIMIT_EXCEEDED' });
      await page.waitForChanges();

      expect(page.rootInstance.error.code).toBe(PlaidErrorCodes.PLAID_RATE_LIMITED);
      expect(page.rootInstance.error.message).toBe(PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_RATE_LIMITED]);
    });

    it('should handle unknown error with custom message', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.handlePlaidError({
        error_code: 'UNKNOWN_ERROR',
        error_message: 'Custom error message',
      });
      await page.waitForChanges();

      expect(page.rootInstance.error.message).toBe('Custom error message');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.error = {
        code: PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED,
        message: 'Test error',
        severity: ComponentErrorSeverity.ERROR,
        retryable: true,
      };

      page.rootInstance.clearError();
      await page.waitForChanges();

      expect(page.rootInstance.error).toBeNull();
    });
  });

  describe('disconnectedCallback', () => {
    it('should clean up timeouts and abort controllers', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      const mockAbortController = { abort: jest.fn() } as any;

      page.rootInstance.timeoutId = setTimeout(() => {}, 1000);
      page.rootInstance.abortController = mockAbortController;

      page.rootInstance.disconnectedCallback();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(mockAbortController.abort).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('button interactions', () => {
    it('should call openPlaidLink when button is clicked', async () => {
      mockPlaidService.getLinkTokenForVerification.mockResolvedValue({
        data: {
          id: 'link_token_id_123',
          link_token: 'link_token_abc',
        },
        error: null,
      } as any);

      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      await page.rootInstance.initializePlaidLink();
      await page.waitForChanges();

      const button = page.root.querySelector('button');
      const openPlaidLinkSpy = jest.spyOn(page.rootInstance, 'openPlaidLink');

      button.click();
      await page.waitForChanges();

      expect(openPlaidLinkSpy).toHaveBeenCalled();
    });

    it('should disable button when loading', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      page.rootInstance.isLoading = true;
      await page.waitForChanges();

      const button = page.root.querySelector('button');
      expect(button.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('event emissions', () => {
    it('should emit plaidVerificationError on error', async () => {
      const page = await newSpecPage({
        components: [PlaidVerification],
        template: () => (
          <plaid-verification
            authToken="test-token"
            accountId="acc_123"
            businessId="biz_123"
          />
        ),
      });

      const errorEventSpy = jest.fn();
      page.root.addEventListener('plaidVerificationError', errorEventSpy);

      const testError = {
        code: PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED,
        message: 'Test error',
        severity: ComponentErrorSeverity.ERROR,
        retryable: true,
      };

      page.rootInstance.handleError(testError);
      await page.waitForChanges();

      expect(errorEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: testError,
        })
      );
    });
  });
});
