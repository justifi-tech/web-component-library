// Mock the store before importing the component
const mockCheckoutStore = {
  selectedPaymentMethod: '',
  authToken: 'test-token',
  accountId: 'test-account',
  checkoutId: 'test-checkout',
};

jest.mock('../../../store/checkout.store', () => ({
  checkoutStore: mockCheckoutStore,
  onChange: jest.fn().mockReturnValue(jest.fn()),
}));

// Mock SVG imports
jest.mock('../../../assets/plaid-icon.svg', () => 'mocked-svg-path');

// Mock the PlaidService
jest.mock('../../../api/services/plaid.service');

import { newSpecPage } from '@stencil/core/testing';
import { PlaidPaymentMethod } from './plaid-payment-method';

describe('PlaidPaymentMethod', () => {
  let component: PlaidPaymentMethod;
  let page: any;

  beforeEach(async () => {
    // Reset store state
    mockCheckoutStore.selectedPaymentMethod = '';
    mockCheckoutStore.authToken = 'test-token';
    mockCheckoutStore.accountId = 'test-account';
    mockCheckoutStore.checkoutId = 'test-checkout';

    // Mock Plaid global
    (global as any).Plaid = {
      create: jest.fn().mockReturnValue({
        open: jest.fn(),
      }),
    };

    page = await newSpecPage({
      components: [PlaidPaymentMethod],
      html: '<justifi-plaid-payment-method></justifi-plaid-payment-method>',
    });

    component = page.rootInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should render without crashing', async () => {
      // Wait for component to render
      await page.waitForChanges();

      // Basic check that component exists
      expect(component).toBeTruthy();
      expect(page.root).toBeTruthy();
    });

    it('should initialize with correct default state', () => {
      expect(component.isSelected).toBe(false);
      expect(component.publicToken).toBeNull();
      expect(component.error).toBeNull();
    });
  });

  describe('Store Integration', () => {
    it('should initialize selection state from store', () => {
      // Set store value before creating component
      mockCheckoutStore.selectedPaymentMethod = 'plaid';

      // Recreate component to test initialization
      return newSpecPage({
        components: [PlaidPaymentMethod],
        html: '<justifi-plaid-payment-method></justifi-plaid-payment-method>',
      }).then(page => {
        const component = page.rootInstance;
        expect(component.isSelected).toBe(true); // Component should initialize with selection state from store
      });
    });
  });

  describe('Component Methods', () => {
    it('should provide isCurrentlySelected method', async () => {
      component.isSelected = true;
      const result = await component.isCurrentlySelected();
      expect(result).toBe(true);
    });

    it('should provide reset method', async () => {
      component.publicToken = 'test-token';
      component.error = {
        code: 'plaid-sdk-load-failed' as any,
        message: 'test-error',
        severity: 'error' as any,
        retryable: true
      };

      await component.reset();

      expect(component.publicToken).toBeNull();
      expect(component.error).toBeNull();
      expect(component.isAuthenticating).toBe(false);
    });
  });
});
